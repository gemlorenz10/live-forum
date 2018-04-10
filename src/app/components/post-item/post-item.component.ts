import { Component, OnInit, Input } from '@angular/core';
import { POST, USER, FireService } from '../../modules/firelibrary/core';

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

  author = <USER>{};

  constructor( public fire: FireService ) { }

  ngOnInit() {
    this.author.uid = this.post.uid;
  }

  getAuthor() {
  }


}
