import { FireService } from './modules/firelibrary/providers/fire.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { LibService } from './providers/lib.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  private isSystemInstalled;
  private authStateUnsubscribe;
  private isLogin: boolean;
  constructor(private fire: FireService, private router: Router) {

  }
  ngOnInit() {
    this.watchAuth();
    // console.log(sessionStorage.getItem('systemInstalled'));
    // if (sessionStorage.getItem('systemInstalled') === 'yes') {
    //   this.isSystemInstalled = true;
    // }
    console.log('Installed?', this.isSystemInstalled);
    if ( !this.isSystemInstalled ) {
      this.systemInstall();
    }
  }

  ngOnDestroy() {
    console.log('onDestry');
    if ( typeof this.authStateUnsubscribe === 'function' ) {
      this.authStateUnsubscribe();
    }
  }

  onFinishInstall(isInstalled: boolean) {
    this.isSystemInstalled = isInstalled;
  }

  onClickLogout() {
    this.fire.user.logout();
  }

  private systemInstall() {
    this.fire.checkInstall()
    .then(res => {
      // if ( res.data.installed ) {
      //   sessionStorage.setItem('systemInstalled', 'yes');
      // }
      this.isSystemInstalled = res.data.installed;
      console.log('Is system installed?', this.isSystemInstalled);
    });
  }

  private watchAuth() {
    this.authStateUnsubscribe = this.fire.auth.onAuthStateChanged(user => {
      if (user) {
        console.log('Logged in');
        this.isLogin = true;
      } else {
        console.log('Logged out');
        this.isLogin = false;
      }
    });
  }

}
