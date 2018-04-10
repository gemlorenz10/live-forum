import { LibService } from './../../providers/lib.service';
import { Component, OnInit } from '@angular/core';
import { POST, FireService, CATEGORY } from '../../modules/firelibrary/core';

@Component({
  selector: 'forum-page',
  templateUrl: './forum-page.html',
  styleUrls: ['./forum-page.scss']
})
export class ForumPage implements OnInit {

  post = <POST>{};
  postList = <Array<POST>>[];
  categoryList: Array<CATEGORY> = [];
  activeCategory = <CATEGORY>{id: ''};
  showCategory: boolean;


  constructor( public fire: FireService, public lib: LibService ) { }

  ngOnInit() {
    // this.activeCategory =
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

  onClickCategory(category?: CATEGORY) {
    if (category) {
      this.activeCategory = category;
      this.postList = []; // clear post list when jumping to another category
      this.getPostPage();
    }

    // console.log(this.activeCategory);
  }

  onClickAllCategory() {
    this.activeCategory = {id: ''};
  }

  onPostCreate(post) {
  }

  getPostPage() {
    if (this.activeCategory.id) {
      this.fire.post.page({ category: this.activeCategory.id, limit: this.activeCategory.numberOfPostsPerPage})
      .then((postObj: Array<POST>) => {
        for (const postId in postObj) {
          if (postObj.hasOwnProperty(postId)) {
            this.postList.push(postObj[postId]);
          }
        }
        console.log(postObj);
      })
      .catch(e => {
        this.lib.failure(e, 'Error on geting post page.');
      });
    }
  }

}
