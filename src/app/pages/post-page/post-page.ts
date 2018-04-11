import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FireService, RESPONSE, POST, CATEGORY, CATEGORY_GET } from '../../modules/firelibrary/core';
import { LibService } from '../../providers/lib.service';

@Component({
  selector: 'post-page',
  templateUrl: './post-page.html',
  styleUrls: ['./post-page.scss']
})
export class PostPage implements OnInit {

  post = <POST>{};
  category = <CATEGORY>{};

  constructor( public fire: FireService, public route: ActivatedRoute, public lib: LibService ) { }

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.getPost(id)
      .then(() => {
        this.getCategory();
      })
      .catch(e => {
        this.lib.failure(e, 'Error on page initialization.');
      });
    }
  }

  getPost(id) {
    return this.fire.post.get(id)
    .then((re: RESPONSE) => {
      this.post = re.data;
      console.log('Parsed data on post-page', re.data);
    })
    .catch(e => {
      this.lib.failure(e, 'Error on getting the post');
    });
  }

  getCategory() {
    return this.fire.category.get(this.post.category)
    .then((re: CATEGORY_GET) => {
      this.category = re.data;
    })
    .catch(e => {
      this.lib.failure(e, 'Error on getting category.');
    });
  }

}
