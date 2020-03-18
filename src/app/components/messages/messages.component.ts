import { AngularFirestore } from '@angular/fire/firestore';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  userMessage: { id: string; allMessage: any; newMessage: any; }[];

  messageForm = new FormGroup({
    message: new FormControl('', [
      Validators.required
    ])
  })
  allMessage: any;
  index: any;
  messages: any;
  constructor(private db: AngularFirestore) { }

  ngOnInit(): void {
    this.db.collection('messages').snapshotChanges().subscribe(e => {
      this.userMessage = e.map(message => {
        return ({
          id: message.payload.doc.id,
          user: message.payload.doc.data()['user'],
          allMessage: message.payload.doc.data()['allMessage'],
          newMessage: message.payload.doc.data()['new_messages']
        })
      })

    })
  }


  getMessage(id, docId) {
    console.log(docId)
    let div = document.querySelector(docId).style;
    div.display = (div.display === 'none') ? 'block' : 'none'
    this.db.collection('messages').doc(id).valueChanges().subscribe(e => {
      this.messages = e['allMessage'];
      console.log(e)
    })

  }

  sendMessage(userId) {
    this.db.collection('messages').doc(userId).valueChanges().subscribe(message => {
      this.allMessage = message['allMessage'];
      this.allMessage.push(this.messageForm.value.message);
      this.db.collection('messages').doc(userId).set({
        allMessage: this.allMessage
      }, { merge: true })
    })
  }
}
