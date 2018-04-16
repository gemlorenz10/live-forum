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
  activeCategory = <CATEGORY>{id: ''}; // Active category shown. @Todo remove this and work with fire.post.selectedCategory

  showCategory: boolean; // for post-list `true` if show in post-item otherwise `false`.
  openPostView: boolean;

  postViewData = <POST>{}; // Post data to be viewed

  loader;
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
        // listenOnCommentChan  ge: true,
        listenOnPostLikes: true
      });
      this.loadPostPage();
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
    this.loader = true;
    console.log('Load starts  ', this.fire.post.pagePostIds);
    if (category) {
      this.activeCategory = category;
      this.loadPostPage(category.id)
      .then(() => {
        this.loader = false;
      });
    }
  }

  onOpenPost(post: POST) {
    this.postViewData = post;
    this.openPostView = true;

  }

  loadPostPage(categoryId = 'all') {
    return this.fire.post.page({ category: categoryId, limit: this.activeCategory.numberOfPostsPerPage})
    .then(re => {
      if (re) {
        console.log('Load finishes', this.fire.post.pagePostIds);
      }
    })
    .catch(e => {
      this.lib.failure(e, 'Error on geting post page.');
    });
  }

}
