import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { POST, FireService } from '../../modules/firelibrary/core';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss']
})
export class PostFormComponent implements OnInit, OnChanges {

  /**
   * ID of the category on which the post will be submitted.
   */
  @Input() categoryId: string;

  post = <POST>{}; // post to be submitted.

  constructor( public fire: FireService ) { }

  ngOnInit() {
    this.post.options = { liveChat: false };
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['categoryId']) {
      this.post.category = this.categoryId;
    }
  }


}
