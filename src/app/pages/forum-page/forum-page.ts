import { LibService } from './../../providers/lib.service';
import { Component, OnInit } from '@angular/core';
import { POST, FireService, CATEGORY } from '../../modules/firelibrary/core';

@Component({
  selector: 'forum-page',
  templateUrl: './forum-page.html',
  styleUrls: ['./forum-page.scss']
})
export class ForumPage implements OnInit {

  post = <POST>{}; // Post to be posted.
  postList = <Array<POST>>[]; // List of loaded posts.
  categoryList: Array<CATEGORY> = []; // List of all categories available.
  activeCategory = <CATEGORY>{id: ''}; // Active category shown.

  showCategory: boolean; // for post-list `true` if show in post-item otherwise `false`.

  constructor( public fire: FireService, public lib: LibService ) { }

  ngOnInit() {
    this.getCategories()
    .then(() => {
      this.activeCategory = this.categoryList[this.categoryList.findIndex(e => e.id === 'all')];
    })
    .then(() => {
      this.getPostPage();
    })
    .catch(e => {
      this.lib.failure(e, 'Error on loading all posts on init.');
    });
  }

  getCategories() {
    return this.fire.category.categories()
    .then((cat: Array<CATEGORY>) => {
      this.categoryList = cat;
    })
    .catch(e => {
      this.lib.failure(e, 'Error on getting categories.');
    });
  }

  onClickCategory(category?: CATEGORY) {
    if (category) {
      this.activeCategory = category;
      this.postList = []; // clear post list when jumping to another category
      this.getPostPage();
    }
  }

  onPostCreate(post) {
    // post.created = (new Date).getTime();
    this.postList.unshift(post);
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
      })
      .catch(e => {
        this.lib.failure(e, 'Error on geting post page.');
      });
    }
  }

}
