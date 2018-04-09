import { Component, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { FireService } from './modules/firelibrary/providers/fire.service';


import { LibService } from './providers/lib.service';
import { USER, USER_CREATE } from './modules/firelibrary/core';

import * as firebase from 'firebase';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnChanges, OnDestroy {

  isSystemInstalled;
  profilePhoto;
  user = <USER>{};
  authStateUnsubscribe;
  constructor(public fire: FireService, public lib: LibService) {
    this.profilePhoto = this.lib.DEFAULT_PROFILE_PHOTO;

  }

  ngOnInit() {
    this.watchAuth();
    if ( !this.isSystemInstalled ) {
      this.checkSystemInstall();
    }

  }
  ngOnChanges(changes: SimpleChanges) {

    // if (changes['isLogin']) {
    //   if (this.isLogin) {
    //     this.listenUserChanges();
    //   } else {
    //     this.fire.user.unlisten();
    //   }
    // }

  }

  ngOnDestroy() {
    console.log('App component destroyed');
    if ( typeof this.authStateUnsubscribe === 'function' ) {
      this.authStateUnsubscribe();
      this.fire.user.unlisten();
    }
  }

  onFinishInstall(isInstalled: boolean) {
    if ( isInstalled ) {
      this.isSystemInstalled = isInstalled;
    } else {
      window.location.reload();
    }

  }

  onClickLogout() {
    this.fire.user.unlisten();
    this.fire.user.logout()
    .then(a => {
      // console.log('Logged out.');
      this.lib.openHomePage();
    })
    .catch(e => {
      if (e.message) {
        alert('Error logging out ' + e.message);
      }
      console.log('Error logging out', e);
    });
    // this.authStateUnsubscribe();
    // this.fire.user.unlisten();
  }

  checkSystemInstall() {
    this.fire.checkInstall()
    .then(res => {
      this.isSystemInstalled = res.data.installed;
      console.log('Is system installed?', this.isSystemInstalled);
    });
  }

  watchAuth() {
    this.authStateUnsubscribe = this.fire.auth.onAuthStateChanged(user => {
      if (user) {
        console.log('Auth State: Logged in', user);
        this.user.displayName = user.displayName;
        this.listenUserChanges();
      } else {
        console.log('Auth state: Logged out');
      }
    });
  }

  onRouteActivate( e ) {
    console.log('Route activated', e);
    // this.loader = false;
  }

  onRouteDeactivate(e ) {
    console.log('Route Deactivated', e );
    // this.loader = true;
  }

  listenUserChanges() {
    console.log('Listening to user changes');
      this.fire.user.listen((user: USER) => {
        this.user.displayName = user.displayName;
        if (user.profilePhoto && user.profilePhoto.thumbnailUrl) {
          this.profilePhoto = user.profilePhoto.thumbnailUrl;
        }
        console.log('User updated!', user);
      });
    }

}
