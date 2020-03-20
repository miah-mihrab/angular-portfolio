import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { PostService } from './../../services/post/post.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  AngularFireStorage,
  AngularFireStorageReference
} from '@angular/fire/storage';
import { finalize } from 'rxjs/operators'
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AppService } from 'src/app/services/app/app.service';
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
  posts;

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
  downloadUrl: Observable<String>;
  fileRef: AngularFireStorageReference;
  dataloaded: boolean = false;
  constructor(private appService: AppService, private aFireStorage: AngularFireStorage, private router: Router, private postService: PostService, private aFAuth: AngularFireAuth, private db: AngularFirestore) { }

  ngOnInit(): void {
    let user = JSON.parse(localStorage.getItem('user'));
    if (!user.admin) {
      alert("Your are not authorized to access this route")
      this.router.navigate(['/'])
    } else {
      this.postService.getAllPost().subscribe(e => {
        this.posts = e.map(data => {
          return ({
            id: data.payload.doc.id,
            data: data.payload.doc.data()
          })
        })
      })
      this.dataloaded = true;
    }

  }

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
        this.postService.addCompletedProject(this.fileRef, formValue);
      })
    ).subscribe()

  }

  edit(id) { }
  remove(id, imgUrl) {
    this.postService.deletePost(id, imgUrl)
  }

  signout() {
    this.aFAuth.auth.signOut();
  }

}
