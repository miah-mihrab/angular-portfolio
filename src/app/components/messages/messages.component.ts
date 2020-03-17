import { AngularFirestore } from '@angular/fire/firestore';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  userMessage: { id: string; allMessage: any; newMessage: any; }[];

  constructor(private db: AngularFirestore) { }

  ngOnInit(): void {
    this.db.collection('messages').snapshotChanges().subscribe(e => {
      this.userMessage = e.map(message => {
        console.log(message.payload.doc.data())
        return ({
          id: message.payload.doc.id,
          user: message.payload.doc.data()['user'],
          allMessage: message.payload.doc.data()['allMessage'],
          newMessage: message.payload.doc.data()['new_messages']
        })
      })
    })
  }


}
