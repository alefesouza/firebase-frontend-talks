<template>
  <div class="mdl-layout mdl-js-layout mdl-layout--fixed-drawer
mdl-layout--fixed-header" id="app">
    <header class="mdl-layout__header">
        <div class="mdl-layout__header-row">
            <span class="mdl-layout-title">Firebase To-Do</span>
            <div class="mdl-layout-spacer"></div>
            <button class="mdl-button mdl-button--icon" title="Log Out" v-if="isLoggedIn" @click="logout()">
                <i class="material-icons">exit_to_app</i>
            </button>
        </div>
    </header>
    <div class="mdl-layout__drawer">
        <span class="mdl-layout-title">To-Do</span>
        <nav class="mdl-navigation">
            <router-link class="mdl-navigation__link" to="/" v-if="!isLoggedIn">Login</router-link>
            <router-link class="mdl-navigation__link" to="create-account" v-if="!isLoggedIn">Create Account</router-link>
            <router-link class="mdl-navigation__link" to="todos" v-if="isLoggedIn">To-Dos</router-link>
        </nav>
    </div>
    <main class="mdl-layout__content">
        <div class="page-content">
            <router-view />
        </div>
    </main>
  </div>
</template>

<script>
import firebase from 'firebase';

export default {
  name: 'app',
  mounted() {
    firebase.auth().onAuthStateChanged(user => {
      this.isLoggedIn = !!user;
    });
  },
  data() {
    return {
      isLoggedIn: false,
    };
  },
  methods: {
    logout() {
      firebase.auth().signOut()
        .then(() => {
          alert('You have been logged out successfully.');
          this.$router.push('/');
        })
        .catch(() => {
          alert('An error occurred.');
        });
    }
  }
}
</script>

<style>
body {
  background-color: #eeeeee;
}

.mdl-textfield {
  width: 100%;
}

.mdl-card__actions {
  text-align: right;
}

button.login-with {
  width: 100%;
  margin-bottom: 10px;
}
</style>
