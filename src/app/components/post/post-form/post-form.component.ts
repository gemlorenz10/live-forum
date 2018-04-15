import { RESPONSE, USER, DATA_UPLOAD, POST_EDIT } from './../../../modules/firelibrary/providers/etc/interface';
import { LibService } from './../../../providers/lib.service';
import { Component, OnInit, Input, OnChanges, SimpleChanges, EventEmitter, Output, OnDestroy } from '@angular/core';
import { POST, FireService, POST_CREATE } from '../../../modules/firelibrary/core';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss']
})
export class PostFormComponent implements OnInit, OnChanges, OnDestroy {

  /**
  * ID of the category on which the post will be submitted.
  */
  @Input() categoryId: string;

  /**
  * Emits newly created post.
  */
  @Output() posted = new EventEmitter<POST>();

  post = <POST>{}; // post to be submitted.
  loader;
  author = <USER>{};
  constructor( public fire: FireService, public lib: LibService ) { }

  get postId() {
    return this.fire.user.uid + (new Date()).getTime();
  }

  ngOnInit() {
    // this.getAuthorData();
    this.initPost();
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  ngOnDestroy() {

  }

  initPost() {
    this.post = <POST>{
      id: this.postId,
      data: []
    };
  }

  onUploadDone(data) {
    this.post.data.push(data);
    this.loader = false;
    // console.log('Data URLs', this.post.data, data);
  }

  onSubmit(event: Event) {
    if (event) {
      event.preventDefault();
    }
    this.loader = true;
    this.post.category = this.categoryId;
    this.post.uid = this.fire.user.uid;
    this.post.displayName = this.fire.user.displayName;
    // @Deprecated - We need to change it when author changes its profile photo
    // this.post.authorPhoto = this.author.profilePhoto.thumbnailUrl;

    this.post.liveChatExpires = (new Date()).getTime() + 86400000; // 24 hours from the time created.

    if (this.post.id) { // might be defined in file upload.
      this.post.id = this.post.uid + '-' + (new Date()).getTime();
    }


    if (this.postValidator()) {
      this.fire.post.create(this.post)
      .then((re: POST_CREATE) => {
        // re.data.post.created = (new Date()).getTime();
        this.posted.emit(re.data.post);
        alert('Post created!');
        this.loader = false;
        this.initPost();
      })
      .catch(e => {
        this.lib.failure(e, 'Error on creating post');
        this.loader = false;
        this.initPost();
      });

    } else {
      this.loader = false;
    }
  }

  postValidator() {
    if (! this.post.content) {
      alert('Post has no content!');
      return false;
    } else if (! this.post.title) {
      alert('Post has no title!');
      return false;
    } else {
      return true;
    }
  }

  private getAuthorData() {
    this.fire.user.get(this.fire.user.uid)
    .then((re: RESPONSE) => {
      // this.author = re.data;
      Object.assign(this.author, re.data);
    })
    .catch(e => {
      this.lib.failure(e, 'Error on getting author data on post');
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
