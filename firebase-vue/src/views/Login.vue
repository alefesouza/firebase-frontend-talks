<template>
    <div class="mdl-card mdl-shadow--2dp mdl-cell mdl-cell--12-col mdl-cell--6-col-tablet mdl-cell--1-offset-tablet mdl-cell--6-col-desktop mdl-cell--3-offset-desktop">
        <div class="mdl-card__title">
            <h2 class="mdl-card__title-text">Login</h2>
        </div>
        <div class="mdl-card__supporting-text">
            <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                <input class="mdl-textfield__input" type="text" id="email" v-model="email">
                <label class="mdl-textfield__label" for="email">E-mail</label>
            </div>

            <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                <input class="mdl-textfield__input" type="password" id="password" v-model="password">
                <label class="mdl-textfield__label" for="password">Password</label>
            </div>

            <button class="mdl-button mdl-js-button mdl-button--raised login-with" id="login-facebook">
                Login with Facebook
            </button>

            <button class="mdl-button mdl-js-button mdl-button--raised login-with" id="login-github">
                Login with GitHub
            </button>
        </div>
        <div class="mdl-card__actions mdl-card--border">
            <button class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect mdl-button--raised" @click="login()">
                Login
            </button>
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
      email: '',
      password: '',
    };
  },
  methods: {
    login() {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(() => {
          alert('You have been logged in successfully');
          this.$router.push('todos');
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
    },
  },
};
</script>
