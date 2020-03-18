import { AngularFireAuth } from '@angular/fire/auth';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase';
@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  commentForm = new FormGroup({
    comment: new FormControl('', [
      Validators.required
    ])
  })
  post: {};
  user: {};
  id: any;
  constructor(private route: ActivatedRoute, private db: AngularFirestore, private aFAuth: AngularFireAuth) { }

  ngOnInit(): void {
    this.aFAuth.authState.subscribe(state => {
      this.db.collection('followers').doc(state.uid).get().subscribe(user => {
        this.user = ({ username: user.data()['name'], imgUrl: user.data()['imgUrl'] })
      })
    })
    this.route.params.subscribe(param => {
      this.id = param.id;
      this.db.collection('blog-posts').doc(this.id).valueChanges().subscribe(e => {
        this.db.collection('blog-posts').doc(this.id).collection('comments', ref => ref.orderBy('time', 'asc')).valueChanges().subscribe(ee => {
          this.post = ({
            data: e,
            comments: ee
          })
        })
      })
    })
  }


  comment() {
    this.commentForm.value.commentar = this.user['username'];
    this.commentForm.value.imgUrl = this.user['imgUrl'];
    this.commentForm.value.time = Date.now();
    this.db.collection('blog-posts').doc(this.id).collection('comments').add(this.commentForm.value).catch(err => {
      console.log('##############################')
      console.log(err)
    })
  }
}
