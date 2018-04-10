import { Category } from './../../modules/firelibrary/providers/category/category';
import { Component, OnInit } from '@angular/core';
import { CATEGORY, FireService, CATEGORY_CREATE, CATEGORY_GET, CATEGORY_EDIT } from '../../modules/firelibrary/core';

@Component({
  selector: 'admin-page',
  templateUrl: './admin-page.html',
  styleUrls: ['./admin-page.scss']
})
export class AdminPage implements OnInit {

  /**
   * This is where you initialize submenus.
   *
   * `true` is active otherwise inactive.
   *
   * Beware that you should only put 1 true value on menu keys.
   *
   * `Keys` - will be the name of the menu as well.
   */
  menu = { Category: true, Fake1: false, Fake2: false }; // default is Category so that oninit category component will be shown.
  menuKeys = [];
  constructor( public fire: FireService, public lib: FireService ) { }

  ngOnInit() {
    // this.onClickMenu(this.menu.Category); // populate menu keys
    this.pushMenuKeys();
  }

  onClickMenu(menuKey) {
    for (const key in this.menu) {
      if (this.menu.hasOwnProperty(key)) {
        this.menu[key] = false;
      }
    }
    this.menu[menuKey] = true;
  }

  private pushMenuKeys() {
    for (const key in this.menu) {
      if (this.menu.hasOwnProperty(key)) {
        this.menuKeys.push(key);
      }
    }
  }
}
