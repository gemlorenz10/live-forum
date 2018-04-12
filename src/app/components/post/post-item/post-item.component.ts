import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { POST, USER, FireService, RESPONSE, COMMENT } from '../../../modules/firelibrary/core';

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.scss']
})
export class PostItemComponent implements OnInit, OnChanges {

  /**
   * Option to show category.
   */
  @Input() showCategory: boolean;


  @Input() isRouterLink = true;

  @Input() post = <POST>{};

  @Input() hideCommentButton: boolean;

  @Output() open = new EventEmitter();

  constructor( public fire: FireService, public lib: FireService ) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {

  }

  get getPostDate() {
    const createDate = (new Date(this.post.created)).toDateString();
    const createTime = (new Date(this.post.created)).toLocaleTimeString();
    if ( createDate === (new Date()).toDateString() ) {
      return createTime;
    } else {
      return createTime + '/' + createDate;
    }
  }

}
