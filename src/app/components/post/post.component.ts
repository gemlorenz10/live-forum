import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CATEGORY, POST, FireService } from '../../modules/firelibrary/core';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent {

  @Input() category = <CATEGORY>{};

  @Input() postIds = [];

  @Output() open = new EventEmitter<POST>();

  constructor( public fire: FireService ) { }

}
