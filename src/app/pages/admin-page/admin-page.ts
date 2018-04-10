import { Component, OnInit } from '@angular/core';
import { CATEGORY, FireService, CATEGORY_CREATE, CATEGORY_GET } from '../../modules/firelibrary/core';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.html',
  styleUrls: ['./admin-page.scss']
})
export class AdminPage implements OnInit {

  categoryList = <Array<CATEGORY>>[];
  category = <CATEGORY>{ numberOfPostsPerPage: 5 };
  loader;
  constructor( public fire: FireService ) { }

  ngOnInit() {
    this.fire.category.categories()
    .then(categories => {
      this.categoryList = categories;
    });
  }

  onClickCreateCategory() {
    this.loader = true;
    if ( this.categoryValidator() ) {
      this.fire.category.create(this.category)
      .then((cat: CATEGORY_CREATE) => {
        alert(`Category ${cat.data.id} is created!`);
        return this.getCategory(cat.data.id);
      })
      .then((category: CATEGORY_GET) => {
        this.categoryList.push(category.data);
      })
      .catch(e => {
        if (e.message) {
          alert('Error on Creating Category: ' + e.message);
          console.log('Error on Creating Category: ', e.message);
          this.loader = false;
        }
      });
    } else {
      this.loader = false;
      console.log('FIelds did not pass validator');
    }
  }

  private categoryValidator(): boolean {
    if ( ! this.category.name ) {
      alert('Category name is required.');
      return false;
    } else {
      return true;
    }
    // else if ( this.category.numberOfPostsPerPage > 0 && this.category.numberOfPostsPerPage <= 10 ) {
    //   alert('Category number of posts per page should be 1 - 10.');
    //   return false;
    // }

  }

  getCategory(categoryId: string): Promise<CATEGORY_GET> {
    return this.fire.category.get(categoryId);
  }

}
