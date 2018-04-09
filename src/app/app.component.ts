import { FireService } from './modules/firelibrary/providers/fire.service';
import { Component, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
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
  isLogin: boolean;
  profilePhoto;
  user = <USER>{};
  authStateUnsubscribe;
  constructor(public fire: FireService, public lib: LibService) {
    this.profilePhoto = this.lib.DEFAULT_PROFILE_PHOTO;

  }

  ngOnInit() {
    this.watchAuth();
    if ( !this.isSystemInstalled ) {
      this.systemInstall();
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
    this.isSystemInstalled = isInstalled;
  }

  onClickLogout() {
    this.fire.user.logout();
    // this.authStateUnsubscribe();
    // this.fire.user.unlisten();
  }

  systemInstall() {
    this.fire.checkInstall()
    .then(res => {
      this.isSystemInstalled = res.data.installed;
      console.log('Is system installed?', this.isSystemInstalled);
    });
  }

  watchAuth() {
    this.authStateUnsubscribe = this.fire.auth.onAuthStateChanged(user => {
      if (user) {
        console.log('Logged in', user);
        this.user.displayName = user.displayName;
        this.isLogin = true;
        this.listenUserChanges();
      } else {
        console.log('Logged out');
        this.isLogin = false;
        this.lib.openHomePage();
        this.fire.user.unlisten();
      }
    });
  }

  onRouteActivate( e ) {
    // console.log('Route activated', e);
    // this.loader = false;
  }

  onRouteDeactivate(e ) {
    // console.log('Route Deactivated', e );
    // this.loader = true;
  }

  listenUserChanges() {
    console.log('Listening to user changes');
    this.fire.user.listen((user: USER) => {
      this.user.displayName = user.firstName;
      this.profilePhoto = user.profilePhoto.thumbnailUrl;
      console.log('User updated!', user);
    });

  }

}
