import { USER_CREATE } from './../../modules/firelibrary/providers/etc/interface';
import { FireService } from './../../modules/firelibrary/providers/fire.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { USER } from '../../modules/firelibrary/core';

@Component({
  selector: 'install-page',
  templateUrl: './install-page.html',
  styleUrls: ['./install-page.scss']
})
export class InstallPage implements OnInit {
  /**
  * Emits `true` if system installed correctly. otherwise `false`.
  */
  @Output() finishedInstall = new EventEmitter();

  admin = <USER>{
    displayName: 'Admin'
  };
  private loader = false; // to prevent double action when waiting.
  private confirmPassword;
  constructor( private fire: FireService ) { }

  ngOnInit() {
  }

  onClickInstall() {
    this.loader = true;
    if ( !this.admin.email ) {
      alert('Admin email is required!');
    } else if ( !this.admin.password ) {
      alert('Admin password is required!');
    } else if ( this.admin.password !== this.confirmPassword ) {
      alert('Admin password did not match!');

    } else {



      this.fire.install({email: this.admin.email})
      .then(re => {
        if (re) {
          return this.fire.user.register(this.admin);
        }
      })
      .then((user: USER_CREATE ) => {
        alert('Installation complete. You are now logged in as Admin');
        this.finishedInstall.emit(true);
      })
      .catch(e => {
        alert(e);
        this.finishedInstall.emit(false);
        this.loader = false;
      });
    }


  }
}
