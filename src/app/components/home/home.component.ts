import { PostService } from 'src/app/services/post/post.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  posts: unknown[];
  dataloaded: boolean = false
  constructor(private postService: PostService) { }

  ngOnInit(): void {
    this.postService.latestPosts().subscribe(e => {
      this.posts = e.map(post => {
        return ({
          id: post.payload.doc.id,
          data: post.payload.doc.data()
        })

      })
      this.dataloaded = true;
    })
  }

}
