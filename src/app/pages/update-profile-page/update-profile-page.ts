import { LibService } from './../../providers/lib.service';
import { Component, OnInit, OnDestroy, OnChanges, SimpleChanges, DoCheck } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { USER, DATA_UPLOAD, FireService, USER_CREATE, USER_DATA } from '../../modules/firelibrary/core';

@Component({
  selector: 'update-profile-page',
  templateUrl: './update-profile-page.html',
  styleUrls: ['./update-profile-page.scss']
})
export class UpdateProfilePage implements OnInit, OnChanges, DoCheck, OnDestroy {

  user: USER = null;

  loader;
  // label;
  fileLoader;
  data = <DATA_UPLOAD>{};


  constructor(private fire: FireService, private lib: LibService, public route: ActivatedRoute) {



  }
  ngOnInit() {
    this.loader = true;
    if (this.fire.user.isLogin) {
      this.fire.user.data()
        .then((re: USER_DATA) => {

          this.loader = false;

          this.user = re.data.user;



          this.lib.sanitize(re.data.user);
          if (re.data.user.updated) {
            // this.label = 'Update Profile';
            // this.user.firstName = re.data.user.firstName;
            // this.user.middleName = re.data.user.middleName;
            // this.user.lastName = re.data.user.lastName;
            // this.user.gender = re.data.user.gender;
            // this.user.birthday = re.data.user.birthday;
            // this.user.profilePhoto = re.data.user.profilePhoto;

            // if ( re.data.user.profilePhoto.thumbnailUrl ) {
            //   this.data.thumbnailUrl = re.data.user.profilePhoto.thumbnailUrl;
            // }
          } else {
            // this.label = 'Welcome, ' + this.fire.user.displayName;
          }
        })
        .catch(e => {
          this.loader = false;
          alert('Error on getting data: ' + e.message);
        });
    }

    this.fire.user.listen((user: USER) => {
      if (user.profilePhoto && user.profilePhoto.thumbnailUrl) {
        this.data = user.profilePhoto;
        const url = this.data.thumbnailUrl + '&v=2';
      }
    });


    /// Why the `this.use` is null here?
    console.log('User after init', this.user);

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      //
    }
  }

  ngDoCheck() {
    // if (this.data.thumbnailUrl) {
    //   this.fileLoader = false;
    // } else {
    //   this.fileLoader = true;
    // }
    // console.log('Do CHeck', this.data.thumbnailUrl);
  }

  ngOnDestroy() {
    this.fire.user.unlisten();
  }

  onUploadStart() {
    this.fileLoader = true;
    console.log('Upload starts...');
  }

  onUploadDone(e: DATA_UPLOAD) {
    // console.log('Upload Emits: ', e);
    // thumbnail is being updated by firebase-backend
    if (e[0]) {
      this.user.profilePhoto = e[0];
      this.user.photoURL = e[0].url;
    }
    this.loader = false;
    this.fileLoader = false;

  }

  onClickSubmit() {
    if (this.formValidator()) {
      this.loader = true;
      this.lib.sanitize(this.user);
      this.fire.user.update(this.user)
        .then((res: USER_CREATE) => {
          if (res.data.id) {
            // this.fire.user.unlisten();
            alert('Profile Updated!');
            this.lib.openHomePage();
            this.loader = false;
          } else {
            alert('Error on update return');
            console.log('Error on update return', res);
          }
        })
        .catch(e => {
          // this.fire.user.unlisten();
          alert(e.message);
          console.error(e);
          this.loader = false;
        });
    } else {
      // alert('Validator fails');
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
}
