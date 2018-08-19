<template>
  <div class="mdl-layout mdl-js-layout mdl-layout--fixed-drawer
mdl-layout--fixed-header" id="app">
    <header class="mdl-layout__header">
        <div class="mdl-layout__header-row">
            <span class="mdl-layout-title">Firebase To-Do</span>
        </div>
    </header>
    <div class="mdl-layout__drawer">
        <span class="mdl-layout-title">To-Do</span>
        <nav class="mdl-navigation">
            <router-link class="mdl-navigation__link" to="/">Login</router-link>
            <router-link class="mdl-navigation__link" to="create-account">Create Account</router-link>
            <router-link class="mdl-navigation__link" to="todos">To-Dos</router-link>
        </nav>
    </div>
    <main class="mdl-layout__content">
        <div class="page-content">
            <div class="mdl-grid">
                <router-view />
            </div>
        </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'app',
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
