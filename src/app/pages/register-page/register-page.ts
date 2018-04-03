import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.html',
  styleUrls: ['./register-page.scss']
})
export class RegisterPage implements OnInit, OnDestroy {
  profilePhoto;
  private reader;
  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.reader = null;
  }

  onChangePhoto(e) {
    console.log('CHanged!', e);
    const file = e.target.files[0];
    this.reader = new FileReader();
    this.reader.onloadend = () => {
      this.profilePhoto = this.reader.result;
      console.log('OnLoad', this.reader.result);
    };
    if (file) {
      this.reader.readAsDataURL(file);
    } else {
      this.profilePhoto = '';
    }
  }
}
