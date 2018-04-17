import { DateService } from './../../../providers/date.service';
import { RESPONSE, USER, DATA_UPLOAD, POST_EDIT } from './../../../modules/firelibrary/providers/etc/interface';
import { LibService } from './../../../providers/lib.service';
import { Component, OnInit, Input, OnChanges, SimpleChanges, EventEmitter, Output, OnDestroy } from '@angular/core';
import { POST, FireService, POST_CREATE } from '../../../modules/firelibrary/core';
import { CATEGORY } from '../../../modules/firelibrary/providers/etc/interface';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss']
})
export class PostFormComponent implements OnInit, OnChanges, OnDestroy {

  /**
  * ID of the category on which the post will be submitted.
  */
  @Input() category = <CATEGORY>{
    liveChatTimeout: 0
  };

  @Input() post = <POST>{}; // post to be submitted.

  @Input() editMode: boolean;

  /**
  * Emits newly created post.
  */
  @Output() success = new EventEmitter<POST>();

  /**
   * Emits when close button is pressed.
   */
  @Output() cancel = new EventEmitter<any>();

  loader = {
    form: false,
    file: false
  };
  deletePhotoList = [];
  author = <USER>{};

  editDate: boolean;


  constructor( public fire: FireService, public lib: LibService, public date: DateService ) { }

  get postId() {
    return this.fire.user.uid + (new Date()).getTime();
  }

  ngOnInit() {
    this.initPost();
    this.getAuthorData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['category']) {
      this.initPost();
    }
  }

  ngOnDestroy() {

  }

  initPost() {
    if (! this.editMode) {
      this.post = <POST>{
        id: this.postId,
        data: []
      };
      this.setExpiryToDefault();
    }
  }

  onUploadDone(data) {
    this.post.data.push(data);
    this.loader.file = false;
    // console.log('Data URLs', this.post.data, data);
  }

  onSubmit(event: Event) {
    if (event) {
      event.preventDefault();
    }
    this.loader.form = true;
    if (this.editMode) {
      this.editPost();
    } else {
      this.createPost();
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

  editPost() {
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
      this.loader.form = false;
      alert('Post edited!');
      this.success.emit(this.post);
    })
    .catch(e => {
      this.loader.form = false;
      this.lib.failure(e, 'Error editing post: ' + this.post.id);
    });
  }

  createPost() {
    this.loader.form = true;
    this.post.category = this.category.id;
    this.post.uid = this.fire.user.uid;
    this.post.displayName = this.fire.user.displayName;
    this.post.authorPhoto = this.author.profilePhoto.thumbnailUrl;

    // update expires plus the date now in seconds.
    this.post.liveChatExpires = this.date.sanitizeDatepicker(this.post.liveChatExpires);

    if (this.post.id) { // might be defined in file upload.
      this.post.id = this.post.uid + '-' + (new Date()).getTime();
    }


    if (this.postValidator()) {
      this.fire.post.create(this.post)
      .then((re: POST_CREATE) => {
        alert('Post created!');
        this.loader.form = false;
        this.initPost();
        this.success.emit(re.data.post);
      })
      .catch(e => {
        this.lib.failure(e, 'Error on creating post');
        this.loader.form = false;
        this.initPost();
      });

    } else {
      this.loader.form = false;
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

  setExpiryToDefault() {
    this.post.liveChatExpires = this.date.secondsToDate(this.category.liveChatTimeout + this.date.dateNowInSeconds());
  }
}
