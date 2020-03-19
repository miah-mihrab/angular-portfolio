import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { stat } from 'fs';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  adminForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  })
  constructor(private aFAuth: AngularFireAuth, private router: Router, private db: AngularFirestore) { }

  ngOnInit(): void {
    this.aFAuth.authState.subscribe(state => {
      if (state) {
        if (this.db.collection('admin').doc(state.uid)) {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/']);
        }
      }
    })
  }


  onSubmit() {
    console.log(this.adminForm.value)
    this.aFAuth.auth.signInWithEmailAndPassword(this.adminForm.value.email, this.adminForm.value.password).then(() => {
      this.router.navigate(['/dashboard'])
    }).catch(error => {
      alert("Something went wrong")
    })
  }


}
