import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private aFAuth: AngularFireAuth) { }

  getState() {
    return this.aFAuth.authState;
  }

}
