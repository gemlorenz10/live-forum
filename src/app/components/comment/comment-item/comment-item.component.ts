import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FireService, POST, COMMENT } from '../../../modules/firelibrary/core';
import { LibService } from '../../../providers/lib.service';
import { DateService } from '../../../providers/date.service';


@Component({
  selector: 'app-comment-item',
  templateUrl: './comment-item.component.html',
  styleUrls: ['./comment-item.component.scss']
})
export class CommentItemComponent implements OnInit, OnDestroy {


  @Input() post: POST = {};
  @Input() comment: COMMENT = {};
  form: COMMENT;
  showEditForm = false;
  loader = {
    progress: false
  };
  constructor(
    public fire: FireService,
    public lib: LibService,
    public date: DateService
  ) {
    this.initComment();
  }

  // comments(id): COMMENT {
  //   return this.fire.comment.getComment(id);
  // }
  // get commentIds(): Array<string> {
  //   return this.fire.comment.commentIds[this.post.id];
  // }

  initComment() {
    this.form = { id: this.fire.comment.getId(), data: [] };
  }
  ngOnInit() {
    if (!this.post.id) {
      console.error('Post ID is empty. Something is wrong.');
      return;
    }
  }

  // isMyComment() {
  //   return this.comment.uid === this.fire.user.uid;
  // }

  ngOnDestroy() {
  }

  get commentDate() {
    return this.date.toLocaleDate(this.comment.created);
  }

  get commentTime() {
    return (new Date(this.comment.created)).toLocaleTimeString();
  }

  myComment() {
    return this.comment.uid === this.fire.user.uid;
  }
  /**
  * Creates or Updates a comment.
  * This is being invoked when user submits the comment form.
  *
  *
  * @param parentnId is the parent id. if it is not set, it would be undefined.
  */
  onSubmit(event: Event) {
    console.log(`parentId: ${this.comment.parentId}`, 'form: ', this.form, 'comment:', this.comment);
    if (event) {
      event.preventDefault();
    }
    this.form.postId = this.post.id;
    if (this.comment) {
      this.form.parentId = this.comment.id;
    }
    if (this.fire.user.photoURL) {
      this.form.authorPhoto = this.fire.user.photoURL;
    }
    this.loader.progress = true;
    if (this.form.created) {
      this.fire.comment.edit(this.form).then(re => {
        this.onSubmitThen(re);
        this.showEditForm = false;
      }).catch(e => this.onSubmitCatch(e));
    } else {
      this.fire.comment.create(this.form).then(re => this.onSubmitThen(re)).catch(e => this.onSubmitCatch(e));
    }
    return false;
  }
  onSubmitThen(re) {
    this.initComment();
    this.loader.progress = false;
  }
  onSubmitCatch(e) {
    this.loader.progress = false;
    alert(e.message);
  }


  /**
  * Sets the form to edit.
  */
  onClickEdit() {
    this.showEditForm = true;
    // this.form = this.comment; @deprecated - deletes other properties.
    Object.assign(this.form, this.comment);
    console.log('Edit clicked!', this.form, this.comment);
  }
  /**
  * Hide edit form and show comment.
  */
  onClickEditCancel() {
    this.form = this.comment;
  }


  onClickDelete() {
    console.log('Going to delete: ', this.comment.id);
    this.fire.comment.delete(this.comment.id).then(re => {
      console.log('deleted: ', re.data.id);
    }).catch(e => alert(e.message));
  }

  onClickLike() {
    this.comment['likeInProgress'] = true;
    this.fire.comment.like(this.comment.id).then(re => {
      this.comment['likeInProgress'] = false;
    }).catch(e => alert(e.message));
  }
  onClickDislike() {
    this.comment['dislikeInProgress'] = true;
    this.fire.comment.dislike(this.comment.id).then(re => {
      this.comment['dislikeInProgress'] = false;
    })
    .catch(e => alert(e.message));
  }

}
