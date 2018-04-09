import { USER_CREATE } from './../../modules/firelibrary/providers/etc/interface';
import { FireService } from './../../modules/firelibrary/providers/fire.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { USER } from '../../modules/firelibrary/core';

@Component({
  selector: 'app-install',
  templateUrl: './install.component.html',
  styleUrls: ['./install.component.scss']
})
export class InstallComponent implements OnInit {
  /**
  * Emits `true` if system installed correctly. otherwise `false`.
  */
  @Output() finishedInstall = new EventEmitter();

  admin = <USER>{
    displayName: 'Admin'
  };
  loader; // to prevent double action when waiting.
  confirmPassword;
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

      this.fire.user.register(this.admin)
      .then((re) => {
        const user = <USER>{ };
        if (re.data) {
          user.displayName = this.fire.user.displayName;
          return this.fire.user.create(user);
        }

      })
      .then(user => {
        if (user.data.id) {
          return this.fire.install(this.admin);
        }

      })
      .then((re) => {
        if (re.data === true) {
          alert('Installation complete. You are now logged in as Admin');
          this.finishedInstall.emit(re.data);
        }

      })
      .catch(e => {
        alert(e);
        this.finishedInstall.emit(false);
        this.loader = false;

      });
    }


  }
}
