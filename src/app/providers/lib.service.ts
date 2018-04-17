import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { FireService, _ } from '../modules/firelibrary/core';
import { DateService } from './date.service';

@Injectable()
export class LibService {

  DEFAULT_PROFILE_PHOTO = 'assets/profile.png';
  /**
  * 30 days in seconds
  */
  DEFAULT_LIVECHAT_TIMEOUT = this.date.dayToSec(30);

  constructor(
    public router: Router,
    public fire: FireService,
    public date: DateService
  ) { }

  openHomePage() {
    this.open('');
  }

  openUpdateProfile() {
    this.open('update-profile');
  }
  open(route: string): void {
    this.router.navigate([route]);
  }

  sanitize(obj): any {
    return _.sanitize(obj);
  }

  failure(e, info?) {
    if (e.message) {
      alert(info + ': ' + e.message);
    }
    console.error(info, e);
  }


  /**
  * Checks if object is empty.
  *
  * @param obj
  */
  isEmpty(obj) {
    for (const prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return false;
      }
    }
    return true;
  }

}
