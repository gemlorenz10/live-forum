import { LibService } from './../../providers/lib.service';
import { FireService, USER, DATA_UPLOAD } from './../../modules/firelibrary/core';
import { Component, OnInit, OnDestroy } from '@angular/core';

import * as firebase from 'firebase';
import { Router } from '@angular/router';
// import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.html',
  styleUrls: ['./register-page.scss']
})
export class RegisterPage implements OnInit, OnDestroy {
  public userData = <USER>{};
  public loader = false;
  public passwordConfirmation: string;
  authStateUnsubscribe;
  constructor(
    public fire: FireService,
    private lib: LibService
  ) { }

  ngOnInit() {
    if (this.fire.user.isLogin) {
      this.lib.goToHomePage(); // go to home
    }
  }

  ngOnDestroy() {
  }

  onClickRegister() {
    this.loader = true;
    if (this.registerValidator()) {
      this.fire.user.register(this.userData)
      .then(user => {
        alert(`Registration successful you are now logged in as ${this.userData.displayName}`);
        // this.lib.goToHomePage(); // go to home
        this.lib.openProfile();
      })
      .catch(e => {
        alert('ERROR: ' + e);
        this.loader = false;
      });
    } else {
      this.loader = false;
    }
  }

  private registerValidator() {
    if (!this.userData.email) {
      alert('Email field is required');
      return false;
    } else if (!this.userData.password) {
      alert('Password field is required.');
      return false;
    } else if (this.userData.password !== this.passwordConfirmation ) {
      alert('Password did not match!');
      return false;
    } else if (!this.userData.displayName) {
      alert('Display name field is required!');
      return false;
    } else {
      return true;
    }
  }

}
