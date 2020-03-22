import { AngularFirestore } from '@angular/fire/firestore';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { Router } from '@angular/router';

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
      Validators.required,
      Validators.pattern('[a-zA-Z ]+')
    ])
  });

  signInFollower = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ])
  });

  messageForm = new FormGroup({
    message: new FormControl('', [
      Validators.required
    ])
  })
  user: boolean = false;
  messages: unknown;
  follower: boolean = false;
  constructor(private db: AngularFirestore, private aFAuth: AngularFireAuth, private authService: AuthService, private router: Router) { }
  ngOnInit(): void {

    this.authService.getState().subscribe(state => {
      if (state) {

        this.db.collection('admin').doc(state.uid).get().subscribe(e => {
          if (e.data() === undefined) {
            this.user = true;
            this.db.collection('messages').doc(state.uid).valueChanges().subscribe(msg => {
              this.messages = msg['allMessage'];
            })
          }
        })
      }
    })
  }
  onSubmit() {
    this.aFAuth.auth.createUserWithEmailAndPassword(this.followerForm.value.email, "123456").then((res) => {
      this.db.collection('followers').doc(res.user.uid).set({
        name: this.followerForm.value.name
      })
    })
  }

  ask() {
    this.aFAuth.authState.subscribe(state => {
      if (state) {
        let id = state.uid;
        if (this.db.collection('messages').doc(id)) {
          this.db.collection('messages').doc(id).get().subscribe(e => {
            let messages = e.data().allMessage ? e.data().allMessage : [];
            let new_messages = e.data().new_messages ? e.data().new_messages : [];
            messages.push(this.messageForm.value.message);
            new_messages.push(this.messageForm.value.message);

            this.db.collection('messages').doc(id).set({
              allMessage: messages,
              new_messages: new_messages
            }, { merge: true })
          })
        }
      }
    })
  }

  setFollower() {
    this.follower = !this.follower;
  }

  signIn() {
    this.authService.signIn(this.signInFollower.value.email);
  }
  signout() {
    this.authService.signOut();
    this.user = false;
  }
}
