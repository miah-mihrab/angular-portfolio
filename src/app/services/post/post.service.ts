import { AngularFireStorage } from '@angular/fire/storage';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private db: AngularFirestore, private aFStorage: AngularFireStorage) { }

  addCompletedProject(fileRef, formValue) {
    fileRef.getDownloadURL().subscribe(url => {
      this.db.collection('/completed-projects').add({
        title: formValue.title,
        about: formValue.about,
        live_link: formValue.live_link,
        thumbnail: url
      })
    })
  }

  createPost(fileRef, formValue) {
    fileRef.getDownloadURL().subscribe(url => {
      this.db.collection('blog-posts').add({
        title: formValue.title,
        post: formValue.details,
        brief: formValue.brief,
        tags: formValue.tags,
        createdtime: formValue.createdtime,
        imgUrl: url

      })
    })

  }
  getAllPost() {
    return this.db.collection('blog-posts').snapshotChanges();
  }
  getSinglePost(id) {
    return this.db.collection('blog-posts').doc(id).valueChanges();
  }
  latestPosts() {
    return this.db.collection('blog-posts', ref => ref.limit(3).orderBy('createdtime', 'desc')).snapshotChanges();
  }
  getComments(id) {
    return this.db.collection('blog-posts').doc(id).collection('comments', ref => ref.orderBy('time', 'asc')).valueChanges();
  }
  postComment(id, formValue) {
    this.db.collection('blog-posts').doc(id).collection('comments')
      .add(formValue)
      .catch(err => {
        alert("Something went wrong")
      })
  }
  updatePost(formValue, fileRef, id, imgUrl) {
    this.aFStorage.storage.refFromURL(imgUrl).delete().then(() => {
      fileRef.getDownloadURL().subscribe(url => {
        this.db.collection('/blog-posts').doc(id).set({
          title: formValue.title,
          tags: formValue.tags,
          brief: formValue.brief,
          post: formValue.details,
          imgUrl: url,
          createdtime: formValue.createdtime
        })
      })
      alert("Post Updated")
    }).catch(() => {
      alert("Something went wrong")
    })

  }
  deletePost(id, imgUrl) {
    this.aFStorage.storage.refFromURL(imgUrl).delete().then(() => {
      this.db.collection('blog-posts').doc(id).delete();
    })

  }


}
