import { AppService } from './../../services/app/app.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from 'src/app/services/post/post.service';

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
  dataloaded: boolean = false;
  constructor(private route: ActivatedRoute, private aFAuth: AngularFireAuth, private postService: PostService, private appService: AppService) { }

  ngOnInit(): void {
    this.aFAuth.authState.subscribe(state => {
      this.appService.getFollowers(state).subscribe(user => {

        if (user.data()) {
        this.user = ({
          username: user.data()['name'], imgUrl: user.data()['imgUrl']
        })
        }

      })

    });

    this.route.params.subscribe(param => {
      this.id = param.id;
      this.postService.getSinglePost(this.id).subscribe(e => {
        this.postService.getComments(this.id).subscribe(ee => {
          this.post = ({
            data: e,
            comments: ee
          })
        })
        this.dataloaded = true
      })
    })
  }


  comment() {
    if (this.user) {
      this.commentForm.value.commentar = this.user['username'];
      this.commentForm.value.imgUrl = this.user['imgUrl'];
      this.commentForm.value.time = Date.now();
      this.postService.postComment(this.id, this.commentForm.value);
    } else {
      alert("You have to login first!")
    }

  }

}
