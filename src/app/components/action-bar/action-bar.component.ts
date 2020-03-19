import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireStorageReference, AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { PostService } from 'src/app/services/post/post.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-action-bar',
  templateUrl: './action-bar.component.html',
  styleUrls: ['./action-bar.component.css']
})
export class ActionBarComponent implements OnInit {

  addCompletedProjectForm = new FormGroup({
    title: new FormControl('', [
      Validators.required
    ]),
    about: new FormControl('', [
      Validators.required
    ]),
    live_link: new FormControl('', [
      Validators.required
    ])
  })

  validateField(min, max) {
    return (new FormControl('', [
      Validators.required,
      Validators.minLength(min),
      Validators.maxLength(max),
      Validators.pattern("[a-zA-Z, ]*")
    ]));
  }
  postForm = new FormGroup({
    title: this.validateField(5, 10),
    tags: this.validateField(5, 30),
    brief: this.validateField(50, 100),
    details: new FormControl("", [
      Validators.required,
      Validators.minLength(100)
    ])
  });

  file;
  uploading: Boolean = false;
  uploadPercentage: String;
  fileRef: AngularFireStorageReference;



  constructor(private db: AngularFirestore, private aFireStorage: AngularFireStorage, private postService: PostService) { }

  ngOnInit(): void {
  }


  uploadThumbnail(event) {
    this.file = event.target.files[0];
    const filePath = `/files/${Date.now()}_${this.file.name}`;
    this.fileRef = this.aFireStorage.ref(filePath);
  }
  onSubmit() {
    const task = this.fileRef.put(this.file);
    let formValue = this.addCompletedProjectForm.value;
    console.log(formValue)
    task.snapshotChanges().pipe(
      finalize(() => {
        console.log("HERE")
        this.fileRef.getDownloadURL().subscribe(url => {
          this.db.collection('/completed-projects').add({
            title: formValue.title,
            about: formValue.about,
            live_link: formValue.live_link,
            thumbnail: url
          })
        })
      })
    ).subscribe()

  }

  post() {
    const task = this.fileRef.put(this.file);
    this.postForm.value.createdtime = firebase.firestore.FieldValue.serverTimestamp();
    let formValue = this.postForm.value

    task.snapshotChanges().pipe(
      finalize(() => {
        this.postService.createPost(this.fileRef, formValue);
      })
    ).subscribe()
  }
}
