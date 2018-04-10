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

  constructor( public fire: FireService, public lib: LibService ) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['categoryId']) {
      this.post.category = this.categoryId;
    }
  }

  onSubmit() {
    this.loader = true;
    this.post.uid = this.fire.user.uid;
    this.post.id = this.post.uid + '-' + (new Date).getTime();

    this.fire.post.create(this.post)
    .then((re: POST_CREATE) => {
      this.posted.emit(re.data.post);
      alert('Post created!');
      this.loader = false;
    })
    .catch(e => {
      this.lib.failure(e, 'Error on creating post');
      this.loader = false;
    });
    // console.log('Submit this: ', this.post);

  }
}
