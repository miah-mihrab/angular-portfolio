import { AngularFirestore } from '@angular/fire/firestore';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  posts: any[];

  constructor(private db: AngularFirestore) { }

  ngOnInit(): void {
    this.db.collection('blog-posts').snapshotChanges().subscribe(e => {

    })
    this.db.collection('blog-posts').snapshotChanges().subscribe(e => {
      this.posts = e.map(data => {
        return ({
          id: data.payload.doc.id,
          data: data.payload.doc.data()
        })
      });
    })
  }

}
