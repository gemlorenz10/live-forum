import { LibService } from './../../providers/lib.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { POST, FireService, CATEGORY, FIRESERVICE_SETTINGS } from '../../modules/firelibrary/core';

@Component({
  selector: 'forum-page',
  templateUrl: './forum-page.html',
  styleUrls: ['./forum-page.scss']
})
export class ForumPage implements OnInit, OnDestroy {

  categoryList: Array<CATEGORY> = []; // List of all categories available.
  activeCategory = <CATEGORY>{id: ''}; // Active category shown.

  showCategory: boolean; // for post-list `true` if show in post-item otherwise `false`.
  openPostView: boolean;

  postViewData = <POST>{}; // Post data to be viewed

  constructor( public fire: FireService, public lib: LibService ) { }

  ngOnInit() {
    this.initPage();
  }


  ngOnDestroy() {
    this.fire.post.stopLoadPage();
  }

  initPage() {
    this.getCategories()
    .then(() => {
      this.activeCategory = this.categoryList[this.categoryList.findIndex(e => e.id === 'all')];
    })
    .then(() => {
      this.fire.setSettings(<FIRESERVICE_SETTINGS>{
        listenOnPostChange: true,    // Set listen settings
        // listenOnCommentChange: true,
      });
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
      this.getPostPage();
    }
  }

  onOpenPost(post: POST) {
    this.postViewData = post;
    this.openPostView = true;

  }

  getPostPage() {
    if (this.activeCategory.id) {
      this.fire.post.page({ category: this.activeCategory.id, limit: this.activeCategory.numberOfPostsPerPage})
      .catch(e => {
        this.lib.failure(e, 'Error on geting post page.');
      });
    }
  }

}
