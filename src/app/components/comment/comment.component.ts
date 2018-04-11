import { Component, OnInit } from '@angular/core';
import { COMMENT } from '../../modules/firelibrary/core';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  comment = <COMMENT>{};
  constructor() { }

  ngOnInit() {
  }

  onCommentSubmit() {

  }
}
