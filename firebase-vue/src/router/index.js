import Vue from 'vue';
import VueRouter from 'vue-router';

import Login from '../views/Login.vue';
import CreateAccount from '../views/CreateAccount.vue';
import Todos from '../views/Todos.vue';

Vue.use(VueRouter);

const router = new VueRouter({
    mode: 'history',
    routes: [{
        path: '/',
        component: Login,
    }, {
        path: '/create-account',
        component: CreateAccount,
    }, {
        path: '/todos',
        component: Todos,
    }],
});

router.afterEach(() => {
    if (!(typeof (componentHandler) == 'undefined')) {
        setTimeout(() => {
            // eslint-disable-next-line
            componentHandler.upgradeAllRegistered();
        }, 250);
    }

    const drawer = document.querySelector('.mdl-layout__drawer');

    if (drawer && drawer.classList.contains('is-visible')) {
        document.querySelector('.mdl-layout__obfuscator').classList.remove('is-visible');
        drawer.classList.remove('is-visible');
    }
});

export default router;
