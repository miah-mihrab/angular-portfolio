import { AngularFirestore } from '@angular/fire/firestore';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  followerForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    name: new FormControl('', [
      Validators.required
    ])
  });
  messageForm = new FormGroup({
    message: new FormControl('', [
      Validators.required
    ])
  })
  constructor(private db: AngularFirestore, private aFAuth: AngularFireAuth) { }
  ngOnInit(): void { }
  onSubmit() {
    this.aFAuth.auth.createUserWithEmailAndPassword(this.followerForm.value.email, "123456").then((res) => {
      console.log(res);
      this.db.collection('followers').doc(res.user.uid).set({
        name: this.followerForm.value.name
      })
    })
  }

  ask() {
    this.aFAuth.authState.subscribe(state => {
      if (state) {
        let id = state.uid;
        // this.db.collection('messages').doc(id).set({
        //  "message": Fieldvalue.arrayUnion('this.messageForm.value.message')
        // })
      }
    })
  }
}
