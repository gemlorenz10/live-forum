import { Component, OnInit, Input } from '@angular/core';
import { POST, USER, FireService, RESPONSE } from '../../../modules/firelibrary/core';

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.scss']
})
export class PostItemComponent implements OnInit {

  /**
   * Input post to be displayed.
   */
  @Input() post: POST;

  /**
   * Option to show category.
   */
  @Input() showCategory: boolean;

  /**
   * Category name;
   */
  @Input() categoryName;

  constructor( public fire: FireService, public lib: FireService ) { }

  ngOnInit() {
    this.post.created =  this.getPostDate();
  }


  getPostDate() {
    const createDate = (new Date(this.post.created)).toDateString();
    const createTime = (new Date(this.post.created)).toLocaleTimeString();
    if ( createDate === (new Date()).toDateString() ) {
      return createTime;
    } else {
      return createTime + '/' + createDate;
    }
  }

}
