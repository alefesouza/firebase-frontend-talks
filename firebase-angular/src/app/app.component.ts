import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';

declare const componentHandler;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  isLoggedIn = false;

  constructor(private afAuth: AngularFireAuth, private router: Router) {
    // MDL router change things
    router.events.subscribe(val => {
      if (val instanceof NavigationEnd) {
        if (!(typeof componentHandler === 'undefined')) {
          setTimeout(() => {
            componentHandler.upgradeAllRegistered();
          }, 250);
        }

        const drawer = document.querySelector('.mdl-layout__drawer');

        if (drawer && drawer.classList.contains('is-visible')) {
          document
            .querySelector('.mdl-layout__obfuscator')
            .classList.remove('is-visible');
          drawer.classList.remove('is-visible');
        }
      }
    });

    afAuth.authState.subscribe(user => {
      if (user) {
        this.isLoggedIn = true;
        return;
      }

      this.isLoggedIn = false;
    });
  }

  logout() {
    this.afAuth.auth
      .signOut()
      .then(() => {
        alert('You have been logged out successfully.');
        this.router.navigate(['/']);
      })
      .catch(() => {
        alert('An error occurred.');
      });
  }
}
