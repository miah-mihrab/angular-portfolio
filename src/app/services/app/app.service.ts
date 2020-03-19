import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private db: AngularFirestore) { }

  getFollowers(state) {
    return this.db.collection('followers').doc(state.uid).get();
  }
}
