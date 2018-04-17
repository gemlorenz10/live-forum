import { DateService } from './../../../providers/date.service';
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

  @Output() close = new EventEmitter<POST>();

  form = <POST>{};
  comment = <COMMENT>{};
  editPost: boolean;
  constructor(public fire: FireService, public lib: LibService, public date: DateService) {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  onClickBack() {
    // this.fire.comment.created.unsubscribe();
    this.close.emit(this.post);
  }

  onClickEdit() {
    Object.assign(this.form, this.post);
    this.editPost = true;
  }

  onEditCancel() {
    this.editPost = false;
    this.post = this.post;
  }

  onStopLiveChat() {
    this.post.liveChatExpires = this.date.dateNow();
    // console.log('Sanitize', this.post.liveChatExpires);
    this.fire.post.edit(this.post)
    .then(() => {
      alert('Live chat stopped!');
    })
    .catch(e => {
      this.lib.failure(e, 'Error on stopping Live Chat.');
    });
  }
}
