import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { FireService } from '../modules/firelibrary/core';

@Injectable()
export class LibService {

  constructor(
    private router: Router
  ) { }

  goToHomePage() {
    this.router.navigate(['']);
  }

  goTo(route: string): void {
    this.router.navigate([route]);
  }
}
