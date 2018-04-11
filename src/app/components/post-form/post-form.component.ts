import { RESPONSE, USER } from './../../modules/firelibrary/providers/etc/interface';
import { LibService } from './../../providers/lib.service';
import { Component, OnInit, Input, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { POST, FireService, POST_CREATE } from '../../modules/firelibrary/core';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss']
})
export class PostFormComponent implements OnInit, OnChanges {

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

  ngOnInit() {
    this.getAuthorData();
  }

  ngOnChanges(changes: SimpleChanges) {
    // if (changes['categoryId']) {
    //   this.post.category = this.categoryId;
    // }
  }

  onSubmit() {
    this.loader = true;
    this.post.category = this.categoryId;
    this.post.uid = this.fire.user.uid;
    this.post.displayName = this.fire.user.displayName;
    this.post.authorPhoto = this.author.profilePhoto.thumbnailUrl;
    this.post.id = this.post.uid + '-' + (new Date).getTime();

    if (this.postValidator()) {
      this.fire.post.create(this.post)
      .then((re: POST_CREATE) => {
        this.posted.emit(re.data.post);
        alert('Post created!');
        this.loader = false;
        this.post = <POST>{};
      })
      .catch(e => {
        this.lib.failure(e, 'Error on creating post');
        this.loader = false;
        this.post = <POST>{};
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
      this.author = re.data;
    })
    .catch(e => {
      this.lib.failure(e, 'Error on getting author data on post');
    });
  }
}
