import { LibService } from './../../providers/lib.service';
import { Component, OnInit, OnDestroy, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { USER, DATA_UPLOAD, FireService, USER_CREATE, USER_DATA } from '../../modules/firelibrary/core';

@Component({
  selector: 'update-profile-page',
  templateUrl: './update-profile-page.html',
  styleUrls: ['./update-profile-page.scss']
})
export class UpdateProfilePage implements OnInit, OnDestroy {
  user: USER = null;
  loader;
  photo = 'assets/profile.png';
  label;
  constructor(private fire: FireService, private lib: LibService, public route: ActivatedRoute) {
  }
  ngOnInit() {
    if (this.fire.user.isLogin) {
      this.fire.user.data()
      .then((re: USER_DATA) => {
        this.user = re.data.user;

        // Set label
        if ( ! re.data.user.updated && re.data.user.created ) {
          this.label = 'Welcome! ' + re.data.user.displayName;
        } else {
          this.label = 'Update Profile';
        }

        // Set profile image
        if (this.user.profilePhoto && this.user.profilePhoto.thumbnailUrl) {
          this.photo = this.user.profilePhoto.thumbnailUrl;
        }

      })
      .catch(e => {
        alert('Error on getting data: ' + e.message);
      });
    }

    this.listenToUserChanges();

    /// Why the `this.use` is null here?
    // Because JS will not wait for Promise to finish. It will execute the next line right after Promise is executed.
    // console.log('User after init e', this.user);

  }

  ngOnDestroy() {
    // delete this.lib;
    // delete this.user;
    // delete this.fire;
    // delete this.loader;
    // delete this.label;
    // delete this.photo;
  }

  onUploadStart() {
    this.loader = true;
    console.log('Upload starts...');
  }

  onUploadDone(data: DATA_UPLOAD) {
    console.log('Upload Emits: ', data);
    // thumbnail is being updated by firebase-functions
    if (data[0]) {
      this.user.profilePhoto = data[0];
      this.user.photoURL = data[0].url;
    }
    this.loader = false;
    console.log('Upload done.', data);

  }

  onClickSubmit() {
    this.loader = true;
    if (this.formValidator()) {
      this.fire.user.unlisten(); // User will be updated before we changed route then loader will be false.
      this.lib.sanitize(this.user);
      this.fire.user.update(this.user)
      .then((res: USER_CREATE) => {

        if (res.data.id) {
          this.lib.openHomePage();
        } else {
          alert('Error on update return');
          console.log('Error on update didnt return id', res);
          this.loader = false;
          this.listenToUserChanges();
        }

      })
      .catch(e => {

        alert(e.message);
        console.error(e);
        this.loader = false;
        this.listenToUserChanges();

      });
    } else {
      console.log('Validator falsy');
      this.loader = false;
    }

  }

  formValidator() {

    if (this.validateBirthday()) {
      alert('Invalid Birthday');
      return false;
    } else if (!this.user.firstName) {
      alert('Firstname field is required.');
      return false;
    } else if (!this.user.lastName) {
      alert('Lastname field is required.');
      return false;
    } else if (!this.user.gender) {
      alert('Gender field is required.');
      return false;
    } else {
      return true;
    }

  }

  validateBirthday(): boolean {
    const now = (new Date()).getTime();
    const bday = (new Date(this.user.birthday)).getTime();
    return now < bday;
  }

  listenToUserChanges() {
    if (this.fire.user.isLogin) {
      this.fire.user.listen((user: USER) => {
        if (user.profilePhoto && user.profilePhoto.thumbnailUrl) {
          this.user = user;
          this.photo = this.user.profilePhoto.thumbnailUrl;
        }
      });
    }
    }


}
