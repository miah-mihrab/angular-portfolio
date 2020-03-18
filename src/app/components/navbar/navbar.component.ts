import { AngularFirestore } from '@angular/fire/firestore';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from 'src/app/services/auth-service/auth.service';

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
  user: boolean = false;
  messages: unknown;
  constructor(private db: AngularFirestore, private aFAuth: AngularFireAuth, private authService: AuthService) { }
  ngOnInit(): void {
    this.authService.getState().subscribe(state => {
      if (state) {
        this.user = true;
        this.db.collection('messages').doc(state.uid).valueChanges().subscribe(msg => {
          this.messages = msg['allMessage'];
        })
      }
    })
  }
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
        // this.db.collection('messages').doc(id).set({
        //  "message": Fieldvalue.arrayUnion('this.messageForm.value.message')
        // })
      }
    })
  }
}
