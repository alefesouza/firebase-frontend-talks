<template>
    <div class="mdl-grid">
        <div class="mdl-card mdl-shadow--2dp mdl-cell mdl-cell--12-col mdl-cell--6-col-tablet mdl-cell--1-offset-tablet mdl-cell--6-col-desktop mdl-cell--3-offset-desktop">
            <div class="mdl-card__title">
                <h2 class="mdl-card__title-text">Create Account</h2>
            </div>
            <div class="mdl-card__supporting-text">
                <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                    <input class="mdl-textfield__input" type="text" id="name" v-model="name">
                    <label class="mdl-textfield__label" for="name">Your Name</label>
                </div>

                <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                    <input class="mdl-textfield__input" type="text" id="email" v-model="email">
                    <label class="mdl-textfield__label" for="email">E-mail</label>
                </div>

                <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                    <input class="mdl-textfield__input" type="password" id="password" v-model="password">
                    <label class="mdl-textfield__label" for="password">Password</label>
                </div>

                <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                    <input class="mdl-textfield__input" type="password" id="password-confirmation" v-model="passwordConfirmation">
                    <label class="mdl-textfield__label" for="password-confirmation">Password Confirmation</label>
                </div>
            </div>
            <div class="mdl-card__actions mdl-card--border">
                <button class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect mdl-button--raised" @click="createAccount()">
                    Create Account
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import firebase from 'firebase';

export default {
  mounted() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.$router.push('todos');
      }
    });
  },
  data() {
    return {
      name: '',
      email: '',
      password: '',
      passwordConfirmation: '',
    };
  },
  methods: {
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
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(() => {
          const { currentUser } = firebase.auth();

          currentUser
            .updateProfile({
              displayName: this.name,
              photoURL: null,
            })
            .then(() => {
              const timestamp = firebase.firestore.FieldValue.serverTimestamp();

              firebase
                .firestore()
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

                  this.$router().push('todos');
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
    },
  },
};
</script>
