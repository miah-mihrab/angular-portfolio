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

  validateField(min, max) {
    return (new FormControl('', [
      Validators.required,
      Validators.minLength(min),
      Validators.maxLength(max),
      Validators.pattern("[a-zA-Z0-9, ]+")
    ]));
  }

  addCompletedProjectForm = new FormGroup({
    title: this.validateField(5, 30),
    about: this.validateField(20, 100),
    live_link: new FormControl('', [
      Validators.required,
      Validators.pattern(new RegExp('(https?:\/\/[^\s]+)'))
    ])
  })


  postForm = new FormGroup({
    title: this.validateField(5, 30),
    tags: this.validateField(3, 30),
    brief: new FormControl("", [
      Validators.required,
      Validators.minLength(15),
      Validators.minLength(50)
    ]),
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

  ngOnInit(): void { }


  uploadThumbnail(event) {
    this.file = event.target.files[0];
    const filePath = `/files/${Date.now()}_${this.file.name}`;
    this.fileRef = this.aFireStorage.ref(filePath);
  }
  onSubmit() {
    const task = this.fileRef.put(this.file);
    let formValue = this.addCompletedProjectForm.value;
    task.snapshotChanges().pipe(
      finalize(() => {
        this.fileRef.getDownloadURL().subscribe(url => {
          this.db.collection('/completed-projects').add({
            title: formValue.title,
            about: formValue.about,
            live_link: formValue.live_link,
            thumbnail: url
          })
        })
        alert("Added a completed project")
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
        alert('Post Created');
      })
    ).subscribe()
  }
}
