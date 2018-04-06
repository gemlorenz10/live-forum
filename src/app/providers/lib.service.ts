import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { FireService } from '../modules/firelibrary/core';

@Injectable()
export class LibService {

  constructor(
    private router: Router
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
    if (obj) {
      if (typeof obj === 'object') {
        Object.keys(obj).forEach(key => obj[key] === undefined && delete obj[key]);
      }
    }
    /** Remove `password` not to save on documents. */
    if (obj && obj['password'] !== void 0) {
      delete obj['password'];
    }
    return obj;
  }
}
