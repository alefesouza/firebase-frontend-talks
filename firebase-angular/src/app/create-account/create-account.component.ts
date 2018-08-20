import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css'],
})
export class CreateAccountComponent implements OnInit {
  name = '';
  email = '';
  password = '';
  passwordConfirmation = '';

  constructor(
    private afAuth: AngularFireAuth,
    private afFirestore: AngularFirestore,
    private router: Router
  ) {}

  ngOnInit() {}

  createAccount() {
    if (this.password !== this.passwordConfirmation) {
      alert('The password and the confirmation does not match.');
      return;
    }

    if (
      !this.name ||
      !this.email ||
      !this.password ||
      !this.passwordConfirmation
    ) {
      alert('Please fill out all fields.');
      return;
    }

    // I will not use async await here because is something very new, a lot of devs do not know it.
    this.afAuth.auth
      .createUserWithEmailAndPassword(this.email, this.password)
      .then(() => {
        const { currentUser } = this.afAuth.auth;

        currentUser
          .updateProfile({
            displayName: this.name,
            photoURL: null,
          })
          .then(() => {
            const timestamp = firebase.firestore.FieldValue.serverTimestamp();

            this.afFirestore
              .collection('users')
              .doc(currentUser.uid)
              .collection('todos')
              .add({
                title: 'Sample To-Do',
                description: 'To-Do Description',
                image: null,
                created_at: timestamp,
              })
              .then(() => {
                alert('Your account has been created successfully.');

                this.router.navigate(['todos']);
              });
          });
      })
      .catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;

        if (errorCode === 'auth/invalid-email') {
          alert('Invalid email.');
        } else {
          alert(errorMessage);
        }
      });
  }
}
