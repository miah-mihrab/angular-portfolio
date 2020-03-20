import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  userId: string;

  constructor(private db: AngularFirestore, private aFAuth: AngularFireAuth) {

    this.aFAuth.authState.subscribe(user => {
      if (user) {
        this.userId = user.uid
        this.db.collection('admin').doc(this.userId).get().subscribe(e => {

          if (e.data() === undefined) {
            localStorage.setItem("user", JSON.stringify({ userId: this.userId, admin: false }))
          } else {
            localStorage.setItem("user", JSON.stringify({ userId: this.userId, admin: true }))
          }
        })
      }

    })

  }

  getFollowers(state) {
    return this.db.collection('followers').doc(state.uid).get();
  }
}
