import { FireService } from './modules/firelibrary/providers/fire.service';
import { Component, OnInit, OnDestroy, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { LibService } from './providers/lib.service';
import { USER, USER_CREATE } from './modules/firelibrary/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {

  isSystemInstalled;
  isLogin: boolean;
  profilePhoto = 'assets/profile.png';
  displayName = 'Please wait...';
  authStateUnsubscribe;
  constructor(public fire: FireService, public lib: LibService) {

  }

  ngOnInit() {
    this.watchAuth();
    console.log('Installed?', this.isSystemInstalled);
    if ( !this.isSystemInstalled ) {
      this.systemInstall();
    }
  }
  ngAfterViewInit() {
    // this.fire.user.listen((u: USER) => {
    //   this.displayName = u.displayName;
    //   this.profilePhoto = u.profilePhoto.thumbnailUrl;
    // });
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

}
