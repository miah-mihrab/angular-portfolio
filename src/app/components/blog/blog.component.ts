import { PostService } from './../../services/post/post.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  posts: any[];
  dataloaded: boolean = false;
  p: 1;
  search
  resevedPosts: any[];
  constructor(private postService: PostService) { }

  ngOnInit(): void {
    this.postService.getAllPost().subscribe(e => {
      this.posts = e.map(data => {
        return ({
          id: data.payload.doc.id,
          data: data.payload.doc.data()
        })
      });
      this.resevedPosts = this.posts
      this.dataloaded = true;
    })
  }

  filter() {
    let filteredPosts = []
    for (let i = 0; i < this.resevedPosts.length; i++) {
      if (this.resevedPosts[i].data.title.toLowerCase().includes(this.search)) {
        filteredPosts.push(this.resevedPosts[i])
      }
    }
    if (filteredPosts.length > 0) {
      this.posts = filteredPosts
    }

  }
}
