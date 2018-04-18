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

  isPastDay(date: string): boolean {
    const now = (new Date()).getTime();
    const dateNow = (new Date(now)).toDateString();

    return (new Date(dateNow)).getTime() > (new Date(date)).getTime();
  }

  /**
   * Gets or converts date into locale date string.
   *
   * @param date date to convert to locale. If empty it will get the current date.
   * @param locale time locale
   * @returns locale date string
   */
  toLocaleDate(date?: string, locale = this.DATE_LOCALE) {
    if (date) {
      return (new Date(date)).toLocaleDateString(locale, this.DATE_FORMAT_OPTION);
    } else {
      return (new Date()).toLocaleDateString(locale, this.DATE_FORMAT_OPTION);
    }

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
