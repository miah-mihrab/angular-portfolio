import { AuthService } from 'src/app/services/auth-service/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
  constructor(private aFAuth: AngularFireAuth, private router: Router, private authService: AuthService) { }

  ngOnInit(): void { }


  onSubmit() {
    this.authService.adminSignIn(this.adminForm.value.email, this.adminForm.value.password);
  }


}
