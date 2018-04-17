import { Component, Input, Output, EventEmitter, OnDestroy, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CATEGORY, POST, FireService, FIRESERVICE_SETTINGS } from '../../modules/firelibrary/core';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit, OnChanges, OnDestroy {

  @Input() category = <CATEGORY>{};

  // @Input() postIds = [];

  @Output() open = new EventEmitter<POST>();

  constructor( public fire: FireService, public lib: FireService ) { }

  ngOnInit() {
    // this.fire.setSettings(<FIRESERVICE_SETTINGS>{
      // listenOnPostChange: true,    // Set listen settings
      // listenOnPostLikes: true,
      // listenOnCommentChange: true,
      // listenOnCommentLikes: true,
    // });
  }

  ngOnChanges(changes: SimpleChanges) {

  }

  ngOnDestroy() {
  }



  // getPostPage() {
  //   if (this.category) {
  //     this.fire.post.page({ category: this.category.id, limit: this.category.numberOfPostsPerPage})
  //     .catch(e => {
  //       this.lib.failure(e, 'Error on geting post page.');
  //     });
  //   }
  // }


}
