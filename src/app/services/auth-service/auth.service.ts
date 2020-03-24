import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  admin: boolean = false;

  constructor(private aFAuth: AngularFireAuth, private db: AngularFirestore, private router: Router) { }

  getAdmin() {
    return this.admin;
  }
  getState() {
    return this.aFAuth.authState;
  }

  signIn(email) {
    this.aFAuth.auth.signInWithEmailAndPassword(email, '123456')
      .then((res) => {
        this.db.collection('/admin').doc(res.user.uid).get().subscribe(e => {
          if (e.data() != undefined) {
            this.admin = true
          } else {
            this.admin = false;
          }
        })
      })
      .catch(err => {
        alert("Something went wrong")
      })
  }

  adminSignIn(email, password) {
    this.aFAuth.auth.signInWithEmailAndPassword(email, password)
      .then((res) => {
        this.admin = true
        this.router.navigate(['/dashboard'])
      }).catch(() => {
        alert("Something went wrong")
      })
  }
  signOut() {
    this.aFAuth.auth.signOut();
  }
}
