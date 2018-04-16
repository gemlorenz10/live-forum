import { LibService } from './../../../providers/lib.service';
import { Component, OnInit, Input, EventEmitter, Output, OnDestroy } from '@angular/core';
import { POST, COMMENT, FireService, FIRESERVICE_SETTINGS } from '../../../modules/firelibrary/core';

@Component({
  selector: 'app-post-view',
  templateUrl: './post-view.component.html',
  styleUrls: ['./post-view.component.scss']
})
export class PostViewComponent implements OnInit, OnDestroy {

  @Input() post: POST;

  @Output() close = new EventEmitter();

  comment = <COMMENT>{};
  constructor(public fire: FireService, public lib: LibService) {}

  ngOnInit() {
    if (this.post.id) {
      this.fire.setSettings(<FIRESERVICE_SETTINGS>{
        // When handing live chat status
        listenOnCommentChange: this.post.liveChatExpires > this.lib.nowInSeconds(),
        listenOnCommentLikes: true,
      });
    }
  }

  ngOnDestroy() {
    this.close.emit();
  }
}
