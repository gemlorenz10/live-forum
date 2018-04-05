import { LibService } from './../../providers/lib.service';
import { Component, OnInit } from '@angular/core';
import { USER, DATA_UPLOAD, FireService, USER_CREATE } from '../../modules/firelibrary/core';

@Component({
  selector: 'update-profile-page',
  templateUrl: './update-profile-page.html',
  styleUrls: ['./update-profile-page.scss']
})
export class UpdateProfilePage implements OnInit {

  user = <USER>{};
  constructor(private fire: FireService, private lib: LibService) { }
  loader;
  ngOnInit() {
  }

  onUploadDone(e: DATA_UPLOAD) {
    console.log('Upload Emits: ', e);
    // thumbnail is being updated by firebase-backend
    this.user.profilePhoto = e;
    this.user.photoURL = e[0].url;
    this.loader = false;
  }

  onClickSubmit() {
    if (this.formValidator()) {
      this.loader = true;
      this.fire.user.create(this.user)
      .then((res: USER_CREATE) => {
        if (res.data.id) {
          this.lib.goToHomePage();
          alert('Profile Updated!');
          this.loader = false;
        }
      })
      .catch(e => {
        alert(e.message);
        console.error(e);
        this.loader = true;
      });
    }

  }

  private formValidator() {
    if (this.validateBirthday()) {
      alert('Invalid Birthday');
      return false;
    } else if (! this.user.firstName) {
      alert('Firstname field is required.');
      return false;
    } else if (! this.user.lastName) {
      alert('Lastname field is required.');
      return false;
    } else if (! this.user.gender) {
      alert('Gender field is required.');
      return false;
    } else {
      return true;
    }
  }
  private validateBirthday(): boolean {
    const now = (new Date()).getTime();
    const bday = (new Date(this.user.birthday)).getTime();
    return now < bday;
  }
}
