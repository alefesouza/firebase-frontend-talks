import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';

  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  ngOnInit() {}

  login() {
    this.afAuth.auth
      .signInWithEmailAndPassword(this.email, this.password)
      .then(() => {
        alert('You have been logged in successfully');
        this.router.navigate(['todos']);
      })
      .catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;

        if (errorCode === 'auth/wrong-password') {
          alert('Wrong password.');
        } else if (errorCode === 'auth/user-not-found') {
          alert('User not found.');
        } else {
          alert(errorMessage);
        }
      });
  }

  loginWith(platform: string) {
    let provider;

    if (platform === 'facebook') {
      provider = new firebase.auth.FacebookAuthProvider();
    } else {
      provider = new firebase.auth.GithubAuthProvider();
    }

    this.afAuth.auth
      .signInWithPopup(provider)
      .then(() => {
        alert('You have been logged in sucessfully');
        this.router.navigate(['todos']);
      })
      .catch(() => {
        alert('An error occurred.');
      });
  }
}
