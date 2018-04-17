import { Injectable } from '@angular/core';

@Injectable()
export class DateService {

    /**
   * Based on Date.toLocaleDateString option.
   */
  DATE_FORMAT_OPTION = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

  /**
   * Language for time
   */
  DATE_LOCALE = 'en-us';


  constructor() { }

  /**
   * Checks if date has passed.
   *
   * @param date valid date string
   *
   * @returns `true` if date has passed. Otherwise false.
   */
  isExpired(expiryDate: string): boolean {
    return (new Date()).getTime() > (new Date(expiryDate)).getTime();
  }

  toLocaleDate(date: string, locale) {
    return (new Date(date)).toLocaleDateString(this.DATE_LOCALE, this.DATE_FORMAT_OPTION);
  }

  toLocaleTime(time: string) {
    return (new Date(time)).toLocaleTimeString(this.DATE_LOCALE);
  }

  sanitizeDatepicker(date) {
    return new Date(date).toString();
  }

  /**
  * Converts seconds to date string based on epoch
  *
  * @param `seconds`
  */
  secondsToDate(seconds: number) {
    return (new Date(seconds * 1000)).toString();
  }

  /**
  * Returns Date.getTime() in seconds.
  */
  dateNowInSeconds() {
    return (new Date()).getTime() / 1000;
  }

  dateNow() {
    return (new Date()).toString();
  }

  /**
  * Converts days to seconds
  * @param numberOfDays - wil convert in seconds
  * @returns value of `numberOfdays` converted to seconds
  */
  dayToSec(numberOfDays): number {
    return numberOfDays * 86400;
  }

  /**
  * Converts seconds to days
  * @param seconds - wil convert in seconds
  * @returns value of `seconds` converted to days
  */
  secToDay(seconds): number {
    return seconds / 86400;
  }

  /**
  * Converts seconds into time format.
  *
  * @param seconds
  */
  // secondToTimeFormat(seconds) {
  //   const d = Math.round(seconds / 86400);
  //   const h = Math.floor(seconds / 3600);
  //   const m = Math.floor((seconds - (h * 3600)) / 60);
  //   const s = Math.floor(seconds - (h * 3600) - (m * 60));

  //   if (h < 24) {
  //     return h + ' Hours';
  //   } else if (h === 0) {
  //     return m + ':' + s + ' Minutes';
  //   } else {
  //     return d + ' Days';
  //   }

  // }

  // /**
  // * Converts seconds to milliseconds
  // * @param seconds
  // */
  // secToMilliSec(seconds: number = 0) {
  //   return seconds * 1000;
  // }

  // milliSecToSec(milliseconds: number = 0) {
  //   return milliseconds / 1000;
  // }



}
