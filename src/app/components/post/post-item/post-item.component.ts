import { DateService } from './../../../providers/date.service';
import { LibService } from './../../../providers/lib.service';
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


  // @Input() isRouterLink = true;

  @Input() post = <POST>{};

  @Input() hideCommentButton: boolean;

  @Output() open = new EventEmitter();

  editPost;
  deletePhotoList = [];

  loader = {
    main: false,
    like: {},
    dislike: {}
  };
  constructor( public fire: FireService, public lib: LibService, public date: DateService ) {
  }

  ngOnInit() {
    // this.getPost(this.post.id)['likeInProgress'] = false;
    // this.getPost(this.post.id)['DislikeInProgress'] = false;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['post']) {

    }
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

  onUploadDone(data) {
    this.post.data.push(data);
    this.loader.main = false;
    console.log('Data URLs', this.post.data, data);
  }
  onClickDeletePhoto(data: DATA_UPLOAD) {
    if ( confirm('Do yo really want to delete this photo?') ) {
      this.deletePhotoList.push(data);
      const p = this.post.data.indexOf(data);
      this.post.data.splice(p, 1);
    }
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
    // post.liveChatExpires = Math.round(this.lib.secToDay(post.liveChatExpires  - this.lib.nowInSeconds()));
    this.post = post;
    // this.post.liveChatExpires = this.post.liveChatExpires  - this.lib.nowInSeconds();
    // console.log('LIVE CHAT EXPIRES ON EDIT', post.liveChatExpires);
  }

  onClickDeletePost(id: string) {
    if (confirm('Do you really want to delete this post?')) {
      console.log('Going to delete: ', id);
      this.fire.post.delete(id).then(re => {
        console.log('deleted: ', re.data.id);
        if (this.post.data) {
          let i;
          for ( i = 0; i < this.post.data.length; i++) {
            this.deleteData(this.post.data[i]);
          }
        }
      }).catch(e => alert(e.message));
    }
  }

  onSubmitEdit(event: Event) {
    this.loader.main = true;
    if (event) {
      event.preventDefault();
    }
    // this.post.liveChatExpires = this.lib.dayToSec(this.post.liveChatExpires) + this.lib.nowInSeconds();
    this.fire.post.edit(this.post)
    .then((re: POST_EDIT) => {
      if (this.deletePhotoList.length > 0) {
          let i;
          for ( i = 0; i < this.deletePhotoList.length; i++) {
            this.deleteData(this.deletePhotoList[i]);
          }
        }
    })
    .then(() => {
      this.deletePhotoList = [];
      this.editPost = false;
      this.loader.main = false;
      alert('Post edited!');
    })
    .catch(e => {
      this.editPost = false;
      this.loader.main = false;
      this.lib.failure(e, 'Error editing post: ' + this.post.id);
    });
  }

  deleteData(data: DATA_UPLOAD) {
    return this.fire.data.delete(data)
    .then((re: RESPONSE) => {
      if (re.data) {
        console.log('File deleted!', data.name);
      }
    })
    .catch(e => {
      this.lib.failure(e, 'Error on deleting data' + data.name);
    });
  }

  onClickLike(id: string) {
    // this.getPost(id)['likeInProgress'] = true;
    this.loader.like[id] = true;
    this.fire.post.like(id).then(re => {
      this.loader.like[id] = false;
    }).catch(e => alert(e.message));
  }
  onClickDislike(id: string) {
    this.loader.dislike[id] = true;
    this.fire.post.dislike(id).then(() => {
      this.loader.dislike[id] = false;
    })
      .catch(e => alert(e.message));
  }
}
