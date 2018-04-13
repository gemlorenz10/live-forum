import { Component, Input, OnInit, OnDestroy, SimpleChanges } from '@angular/core';
import { FireService, POST, COMMENT } from '../../modules/firelibrary/core';


@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit, OnDestroy {


  @Input() post: POST = {};
  @Input() comment: COMMENT = {};
  form: COMMENT;
  loader = {
    progress: false
  };
  constructor(
    public fire: FireService
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

  ngOnDestroy() {
  }


  get commentDate() {
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
    event.preventDefault();
    this.form.postId = this.post.id;
    if (this.comment) {
      this.form.parentId = this.comment.id;
    }
    this.loader.progress = true;
    if (this.form.created) {
      this.fire.comment.edit(this.form).then(re => this.onSubmitThen(re)).catch(e => this.onSubmitCatch(e));
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
    this.form = this.comment;
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
