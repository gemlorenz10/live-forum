import { LibService } from './../../providers/lib.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { USER, FireService } from '../../modules/firelibrary/core';

@Component({
  selector: 'login-page',
  templateUrl: './login-page.html',
  styleUrls: ['./login-page.scss']
})
export class LoginPage implements OnInit, OnDestroy {
  loader;
  user = <USER>{};
  private authStateUnsubscribe;
  constructor(
    private fire: FireService,
    private lib: LibService
  ) { }

  ngOnInit() {
    if (this.fire.user.isLogin) {
      this.lib.openHomePage();
    }
    // this.authStateUnsubscribe = this.fire.auth.onAuthStateChanged(user => {
    //   if (user) {
    //     this.lib.goToHomePage();
    //     console.log(user);
    //   }
    // });
  }

  ngOnDestroy() {
    // if ( typeof this.authStateUnsubscribe === 'function' ) {
    //   this.authStateUnsubscribe();
    // }
  }

  onClickLogin() {
    this.loader = true;
    if (this.loginValidator()) {
      this.fire.user.login(this.user.email, this.user.password)
      .then(a => {
        this.loader = false;
        this.lib.openHomePage();
      })
      .catch(e => {
        alert(e);
        this.loader = false;
      });
    } else {
      this.loader = false;
    }
  }

  /**
  * @returns `true` if fields are okay. Otherwhise `false`.
  */
  private loginValidator(): boolean {
    if (!this.user.email) {
      alert('Email is required');
      return false;
    } else if (!this.user.password) {
      alert('Password is empty.');
      return false;
    } else {
      return true;
    }
  }
}
