import { LibService } from './../../providers/lib.service';
import { Component, OnInit, OnDestroy, SimpleChanges, OnChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { USER, DATA_UPLOAD, FireService, USER_CREATE, USER_DATA } from '../../modules/firelibrary/core';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'update-profile-page',
  templateUrl: './update-profile-page.html',
  styleUrls: ['./update-profile-page.scss']
})
export class UpdateProfilePage implements OnInit, OnChanges, OnDestroy {
  user = <USER>{};
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
        if ( this.user.profilePhoto && this.user.profilePhoto.thumbnailUrl) {
          this.photo = this.user.profilePhoto.thumbnailUrl;
        }

        // Set label
        if ( ! re.data.user.updated && re.data.user.created ) {
          this.label = 'Welcome! ' + re.data.user.displayName;
        } else {
          this.label = 'Update Profile';
        }

      })
      .catch(e => {
        alert('Error on getting data: ' + e.message);
      });
    } else {
      this.lib.openHomePage();
    }
    /// Why the `this.use` is null here?
    // Because JS will not wait for Promise to finish. It will execute the next line right after Promise is executed.
    // console.log('User after init e', this.user);

  }

  ngOnChanges(changes: SimpleChanges) {

  }

  ngOnDestroy() {
    console.log('Update profile Destroyed');
  }

  onUploadStart() {
    this.loader = true;
    console.log('Upload starts...');
  }

  onUploadDone(data: DATA_UPLOAD[]) {
    console.log('Upload Emits: ', data);

    if (data.length > 0) {
      this.user.profilePhoto = data[0];
      this.user.photoURL = data[0].url;
    } else {
      alert('User is not updated!');
    }
    // console.log('Upload done.', this.user);
    this.fire.user.listen((user: USER) => {
      console.log('Listening to user....');
      if (user.profilePhoto && user.profilePhoto.thumbnailUrl) {
        this.photo = user.profilePhoto.thumbnailUrl;
        this.user.profilePhoto.thumbnailUrl = user.profilePhoto.thumbnailUrl;
        this.loader = false;
      }
    });
  }

  onClickSubmit() {
    this.loader = true;
    if (this.formValidator()) {

      this.lib.sanitize(this.user);

      this.fire.user.update(this.user)
      .then((res: USER_CREATE) => {
        if (res.data.id) {
          this.lib.openHomePage();
        } else {
          alert('Error on update return');
          console.log('Error on update didnt return id', res);
          this.loader = false;
        }
      })
      .catch(e => {
        alert(e.message);
        console.error(e);
        this.loader = false;
      });

    } else {
      console.log('Validator is falsy');
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

  // listenToUserChanges() {
  //   if (this.fire.user.isLogin) {
  //     this.fire.user.listen((user: USER) => {
  //       if (user.profilePhoto && user.profilePhoto.thumbnailUrl) {
  //         this.user = user;
  //         this.photo = this.user.profilePhoto.thumbnailUrl;
  //       }
  //     });
  //   }
  // }


}
