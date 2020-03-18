import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import {
  AngularFireStorage,
  AngularFireStorageReference
} from '@angular/fire/storage';
import * as firebase from 'firebase';
import { finalize } from 'rxjs/operators'
import { Observable } from 'rxjs';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

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
      Validators.pattern("[a-zA-Z ]*")
    ]));
  }
  postForm = new FormGroup({
    title: this.validateField(5, 10),
    brief: this.validateField(50, 100),
    details: new FormControl("", [
      Validators.required,
      Validators.minLength(100)
    ])
  });

  file;
  uploading: Boolean = false;
  uploadPercentage: String;
  downloadUrl: Observable<String>;
  fileRef: AngularFireStorageReference;

  constructor(private db: AngularFirestore, private aFireStorage: AngularFireStorage) { }

  ngOnInit(): void { }

  uploadThumbnail(event) {
    this.file = event.target.files[0];
  }
  onSubmit() {
    const filePath = `/files/${Date.now()}_${this.file.name}`;
    this.fileRef = this.aFireStorage.ref(filePath);
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
    console.log(document.querySelector("#editor"))
    console.log(this.postForm.value)
    this.db.collection('blog-posts').add({
      title: this.postForm.value.title,
      post: this.postForm.value.details,
      brief: this.postForm.value.brief,
      createdtime: firebase.firestore.FieldValue.serverTimestamp()
    })
  }

}
