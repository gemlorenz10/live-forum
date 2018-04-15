import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { FireService, _ } from '../modules/firelibrary/core';

@Injectable()
export class LibService {

  DEFAULT_PROFILE_PHOTO = 'assets/profile.png';
  /**
   * 30 days in seconds
   */
  DEFAULT_LIVECHAT_TIMEOUT = this.dayToSec(30);

  constructor(
    public router: Router,
    private fire: FireService
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
   * Converts seconds to milliseconds
   * @param seconds
   */
  secToMilliSec(seconds: number = 0) {
    return seconds * 1000;
  }

  milliSecToSec(milliseconds: number = 0) {
    return milliseconds / 1000;
  }
  /**
   * Converts days to seconds
   * @param numberOfDays - wil convert in seconds
   * @returns value of `numberOfdays` converted to seconds
   */
  dayToSec(numberOfDays): number {
    return numberOfDays * 86400000;
  }

    /**
   * Converts seconds to days
   * @param seconds - wil convert in seconds
   * @returns value of `seconds` converted to days
   */
  secToDay(seconds): number {
    return seconds / 86400000;
  }

  /**
   * Returns Date.getTime() in seconds.
   */
  nowInSeconds() {
    return (new Date()).getTime() / 1000;
  }
}
