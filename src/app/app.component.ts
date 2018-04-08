import { FireService } from './modules/firelibrary/providers/fire.service';
import { Component, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { LibService } from './providers/lib.service';
import { USER, USER_CREATE } from './modules/firelibrary/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnChanges, OnDestroy {

  isSystemInstalled;
  isLogin: boolean;
  profilePhoto;
  displayName;
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
    if (changes['displayName']) {
      this.displayName = this.displayName;
    }
    if (changes['isLogin']) {
      if (this.isLogin) {
        this.fire.user.listen((u: USER) => {
          this.displayName = u.displayName;
          this.profilePhoto = u.profilePhoto.thumbnailUrl;
        });
      } else {
        this.fire.user.unlisten();
      }
    }
  }

  ngOnDestroy() {
    console.log('onDestry');
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
        this.displayName = user.uid;
        this.isLogin = true;
      } else {
        console.log('Logged out');
        this.isLogin = false;
        this.lib.openHomePage();
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

}
