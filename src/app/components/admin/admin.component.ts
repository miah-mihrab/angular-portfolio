import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from 'src/app/services/app/app.service';

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
  constructor(private aFAuth: AngularFireAuth,
    private router: Router,
    private db: AngularFirestore,
    private appService: AppService) {
    // this.aFAuth.auth.signOut()
  }

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
    this.aFAuth.auth.signInWithEmailAndPassword(this.adminForm.value.email, this.adminForm.value.password)
      .then((res) => {
        localStorage.setItem('user', JSON.stringify({ userId: res.user.uid, admin: true }))
      }).then(() => {
        this.router.navigate(['/dashboard'])
      }).catch(() => {
        alert("Something went wrong")
      })
  }


}
