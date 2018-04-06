import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { FireService, _ } from '../modules/firelibrary/core';

@Injectable()
export class LibService {

  constructor(
    private router: Router,
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
}
