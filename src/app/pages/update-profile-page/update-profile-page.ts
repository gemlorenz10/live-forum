import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'update-profile-page',
  templateUrl: './update-profile-page.html',
  styleUrls: ['./update-profile-page.scss']
})
export class UpdateProfilePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  onUploadDone(e) {
    console.log('Upload Emits: ', e);
  }
}
