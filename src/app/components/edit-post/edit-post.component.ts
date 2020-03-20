import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PostService } from 'src/app/services/post/post.service';
import { AngularFireStorageReference, AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css']
})
export class EditPostComponent implements OnInit {
  file;
  uploading: Boolean = false;
  uploadPercentage: String;
  fileRef: AngularFireStorageReference;
  editPostForm: FormGroup;
  id: any;
  imgUrl;
  constructor(private db: AngularFirestore, private route: ActivatedRoute, private postService: PostService, private aFireStorage: AngularFireStorage) {

    this.route.params.subscribe(param => {
      this.id = param.id
      this.postService.getSinglePost(param.id).subscribe(e => {
        this.editPostForm = new FormGroup({
          title: new FormControl(e['title'], [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(30),
            Validators.pattern("[a-zA-Z0-9, ]+")
          ]),
          tags: new FormControl(e['tags'], [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(30),
            Validators.pattern("[a-zA-Z0-9, ]+")
          ]),
          brief: new FormControl(e['brief'], [
            Validators.required,
            Validators.minLength(15),
            Validators.minLength(50)
          ]),
          details: new FormControl(e['post'], [
            Validators.required,
            Validators.minLength(100)
          ])
        })
        this.imgUrl = e['imgUrl']
      })
    })

  }

  ngOnInit(): void { }
  uploadThumbnail(event) {
    this.file = event.target.files[0];
    const filePath = `/files/${Date.now()}_${this.file.name}`;
    this.fileRef = this.aFireStorage.ref(filePath);
  }
  post() {
    const task = this.fileRef.put(this.file);
    let formValue = this.editPostForm.value;
    task.snapshotChanges().pipe(
      finalize(() => {
        this.postService.updatePost(formValue, this.fileRef, this.id, this.imgUrl)

      })
    ).subscribe()
  }
}
