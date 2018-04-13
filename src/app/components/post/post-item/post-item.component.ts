import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { POST, USER, FireService, RESPONSE, COMMENT, DATA_UPLOAD, POST_EDIT } from '../../../modules/firelibrary/core';

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.scss']
})
export class PostItemComponent implements OnInit, OnChanges {

  /**
   * Option to show category.
   */
  @Input() showCategory: boolean;


  @Input() isRouterLink = true;

  @Input() post = <POST>{};

  @Input() hideCommentButton: boolean;

  @Output() open = new EventEmitter();

  editPost;
  loader;
  constructor( public fire: FireService, public lib: FireService ) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {

  }

  get getPostDate() {
    const createDate = (new Date(this.post.created)).toDateString();
    const createTime = (new Date(this.post.created)).toLocaleTimeString();
    if ( createDate === (new Date()).toDateString() ) {
      return createTime;
    } else {
      return createTime + '/' + createDate;
    }
  }

    removeFile(file) {
    if (this.post.data) {
      const pos = this.post.data.findIndex(f => f.fullPath === file.fullPath);
      if (pos !== -1) {
        this.post.data.splice(pos, 1);
      }
    }
  }

  myPost(post: POST) {
    return post.uid === this.fire.user.uid;
  }

  getPost(id) {
    return this.fire.post.pagePosts[id];
  }

    /**
   * Updates the post edit form with the post to edit.
   */
  onClickEdit(post: POST) {
    if (post.deleted) {
      return alert('Post is already deleted.');
    }
    console.log('Update edit form: ', post);
    if (this.fire.user.isLogout) {
      alert('Please login first');
      return;
    } else if (!this.myPost(post)) {
      alert('You are not the owner of the post');
      return;
    }
    this.editPost = true;
    this.post = post;
  }

  onClickDelete(id: string) {
    if (confirm('Do you really want to delete this post?')) {
      console.log('Going to delete: ', id);
      this.fire.post.delete(id).then(re => {
        console.log('deleted: ', re.data.id);
      }).catch(e => alert(e.message));
      if (this.post.data) {
        let i;
        for ( i = 0; i < this.post.data.length; i++) {
          this.deleteData(this.post.data[i]);
        }
      }
    }
  }

  onSubmitEdit(event: Event) {
    this.loader = true;
    if (event) {
      event.preventDefault();
    }
    this.fire.post.edit(this.post)
    .then((re: POST_EDIT) => {
      this.editPost = false;
      this.loader = false;
      alert('Post edited:' + re.data.id);
    })
    .catch(e => {
      this.editPost = false;
      this.loader = false;
      this.lib.failure(e, 'Error editing post: ' + this.post.id);
    });
  }

  deleteData(data: DATA_UPLOAD) {
    this.fire.data.delete(data)
    .then((re: RESPONSE) => {
      if (re.data) {
        console.log('File deleted!', data.name);
      }
    })
    .catch(e => {
      this.lib.failure(e, 'Error on deleting data' + data.name);
    });
  }
}
