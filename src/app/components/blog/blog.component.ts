import { PostService } from './../../services/post/post.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  posts: any[];
  dataloaded: boolean = false;

  constructor(private postService: PostService) { }

  ngOnInit(): void {
    this.postService.getAllPost().subscribe(e => {
      this.posts = e.map(data => {
        return ({
          id: data.payload.doc.id,
          data: data.payload.doc.data()
        })
      });
      this.dataloaded = true;
    })
  }

}
