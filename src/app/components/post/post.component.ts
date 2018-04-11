import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CATEGORY, POST, FireService } from '../../modules/firelibrary/core';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit, OnChanges {

  @Input() category = <CATEGORY>{};

  @Input() postIds = [];

  constructor( public fire: FireService ) { }

  ngOnInit() {
  }


  ngOnChanges(changes: SimpleChanges) {
  }

}
