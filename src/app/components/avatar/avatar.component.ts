import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit, OnChanges {

  /**
   * Pass thumbnail or photo if thumbnail doesn't exists.
   */
  @Input() profilePhoto;
  constructor() { }

  ngOnInit() {
    console.log(this.profilePhoto);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['profilePhoto']) {
      // console.log('ProfilePhoto changes', this.profilePhoto);
    }
  }
}
