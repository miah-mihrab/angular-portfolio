import { PostService } from 'src/app/services/post/post.service';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  posts: unknown[];
  dataloaded: boolean = false
  works: { id: string; data: unknown; }[];
  constructor(private postService: PostService, private db: AngularFirestore) { }

  ngOnInit(): void {
    this.postService.latestPosts().subscribe(e => {
      this.posts = e.map(post => {
        return ({
          id: post.payload.doc.id,
          data: post.payload.doc.data()
        })

      })

    })
    this.db.collection('completed-projects').snapshotChanges().subscribe(e => {
      this.works = e.map(data => {
        return ({
          id: data.payload.doc.id,
          data: data.payload.doc.data()
        })
      })
      this.dataloaded = true;
    })
  }

}
