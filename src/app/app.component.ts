import { Component, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { FireService } from './modules/firelibrary/providers/fire.service';


import { LibService } from './providers/lib.service';
import { USER, USER_CREATE, IS_ADMIN, DATA_UPLOAD } from './modules/firelibrary/core';

import * as firebase from 'firebase';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  isSystemInstalled;
  profilePhoto;
  user = <USER>{};
  isAdmin;
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

  ngOnDestroy() {
  //   console.log('App component destroyed');
  //   if ( typeof this.authStateUnsubscribe === 'function' ) {
  //     this.authStateUnsubscribe();
  //     this.fire.user.unlisten();
  //   }
  }

  onFinishInstall(isInstalled: boolean) {
    if ( isInstalled ) {
      this.isSystemInstalled = isInstalled;
    } else {
      window.location.reload();
    }

  }

  onClickLogout() {
    this.lib.openHomePage();
    this.fire.user.logout();
  }

  checkSystemInstall() {
    this.fire.checkInstall()
    .then(res => {
      this.isSystemInstalled = res.data.installed;
      // console.log('Is system installed?', this.isSystemInstalled);
    });
  }

  watchAuth() {
    this.authStateUnsubscribe = this.fire.auth.onAuthStateChanged(user => {
      if (user) {
        console.log('Auth State: Logged in', user);
        this.user.displayName = user.displayName;
        this.checkIfAdmin();
      } else {
        this.lib.openHomePage();
        this.fire.user.unlisten();
        console.log('Auth state: Logged out');
      }
    });
  }

  // listenUserChanges() {
  //   console.log('Listening to user changes');
  //   this.fire.user.get(this.fire.user.uid)
  //   .then(u => {
  //     this.fire.user.listen((user: USER) => {
  //       this.user.displayName = user.displayName;
  //       if (user.profilePhoto && user.profilePhoto.thumbnailUrl) {
  //         this.profilePhoto = user.profilePhoto.thumbnailUrl;
  //       }
  //       console.log('User updated!', user);
  //     });
  //   });

  // }

  checkIfAdmin() {
    this.fire.user.isAdmin()
    .then((re: IS_ADMIN) => {
      this.isAdmin = re.data.isAdmin;
      console.log('Is it admin?', this.isAdmin);
    })
    .catch(e => {
      alert('Error on checking if user is admin ' + e.message);
      console.log('Error on checking if user is admin ', e);
    });
  }

}
