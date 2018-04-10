import { Component, OnInit } from '@angular/core';
import { POST, FireService, CATEGORY } from '../../modules/firelibrary/core';

@Component({
  selector: 'forum-page',
  templateUrl: './forum-page.html',
  styleUrls: ['./forum-page.scss']
})
export class ForumPage implements OnInit {

  post = <POST>{};
  categoryList: Array<CATEGORY> = [];
  activeCategory = <CATEGORY>{id: ''};
  constructor( public fire: FireService ) { }

  ngOnInit() {
    this.post.options = { liveChat: false };

    this.getCategories();
  }

  getCategories() {
    this.fire.category.categories()
    .then((cat: Array<CATEGORY>) => {
      this.categoryList = cat;
    })
    .catch(e => {
      alert('Error on getting categories: ' + e.message);
      console.log('Error on getting categories: ', e);
    });
  }

  onClickCategory(category: CATEGORY) {
    // Category = e.target.value
    this.activeCategory = category;
    console.log(this.activeCategory);
  }

  onClickAllCategory() {
    this.activeCategory = {id: ''};
  }
}
