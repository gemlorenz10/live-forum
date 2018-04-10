import { Category } from './../../modules/firelibrary/providers/category/category';
import { Component, OnInit } from '@angular/core';
import { CATEGORY, FireService, CATEGORY_CREATE, CATEGORY_GET, CATEGORY_EDIT } from '../../modules/firelibrary/core';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  categoryList = <Array<CATEGORY>>[];
  category = <CATEGORY>{ numberOfPostsPerPage: 5 };
  loader;
  constructor( public fire: FireService, public lib: FireService ) { }

  ngOnInit() {
    this.fire.category.categories()
    .then(categories => {
      this.categoryList = categories;
    });
  }

  onClickSubmitCategory() {
    if ( this.categoryValidator() ) {
      if (this.category.created) {
        this.editCategory();
      } else {
        this.createCategory();
      }

    } else {
      this.loader = false;
      console.log('FIelds did not pass validator');
    }
  }

  onClickEdit(category) {
    this.category = category;
  }

  onClickCancel() {
    this.category = {id: '', numberOfPostsPerPage: 5};
  }

  onClickDelete(category) {
    if (confirm(`Are you sure you want to delete ${category.name} category?`)) {
      this.deleteCategory(category);
    } else { }

  }

  private createCategory() {
    this.loader = true;
      this.fire.category.create(this.category).then((cat: CATEGORY_CREATE) => {
        alert(`Category ${cat.data.id} is created!`);
        return this.getCategory(cat.data.id);
      })
      .then((category: CATEGORY_GET) => {
        this.categoryList.push(category.data);
        this.loader = false;
        this.clearForm();
      })
      .catch(e => {
        if (e.message) {
          this.lib.failure(e, 'Error on creating category');
          this.loader = false;
        }
      });
  }

  private editCategory() {
    // this.category = category;
    this.loader = true;
    this.fire.category.edit(this.category)
    .then((re: CATEGORY_EDIT) => {
      this.loader = false;
      this.clearForm();
      alert('Category edit successful!');
    })
    .catch(e => {
      this.lib.failure(e, 'Error on editing category');
      this.loader = false;
    });
  }

  private deleteCategory(category: CATEGORY) {
    this.loader = true;
    this.fire.category.delete(category.id)
    .then(() => {
      this.loader = false;
      alert('Category deleted.');
      this.categoryList.map( (value, index, list) => {
        if (value.id === category.id) {
          this.categoryList.splice(index, 1);
        }
      });
    })
    .catch(e => {
      this.lib.failure(e, 'Error on deleting category' + category.id);
    });
  }

  private categoryValidator(): boolean {
    if ( ! this.category.name ) {
      alert('Category name is required.');
      return false;
    } else {
      return true;
    }
    // else if ( this.category.numberOfPostsPerPage > 0 && this.category.numberOfPostsPerPage <= 10 ) {
    //   alert('Category number of posts per page should be 1 - 10.');
    //   return false;
    // }

  }

  private clearForm() {
    this.category = {id: '', numberOfPostsPerPage: 5};
  }

  private getCategory(categoryId: string): Promise<CATEGORY_GET> {
    return this.fire.category.get(categoryId);
  }

}
