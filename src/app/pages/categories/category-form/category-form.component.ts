import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { switchMap, toArray } from 'rxjs/operators';
import toastr from 'toastr';
import { Category } from '../shared/category.model';
import { CategoryService } from '../shared/category.service';
@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit, AfterContentChecked {

  currentAction: string;
  categoryForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm = false;

  category: Category = new Category();
  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.setCurrentAction();
    this.buildCategoryForm();
    this.loadCategory();
  }


  ngAfterContentChecked(): void {
    this.setPageTitle();
  }

  submitForm(){
    if (this.currentAction === 'new') {
      this.createCategory();
    } else  {
      this.updateCategory();
    }
  }

  private setCurrentAction() {
    if (this.route.snapshot.url[0].path === 'new') {
      this.currentAction = 'new';
    } else {
      this.currentAction = 'edit';
    }
  }

  private buildCategoryForm() {
    this.categoryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null]
    });
  }

  private loadCategory() {
    if (this.currentAction === 'edit') {
      this.route.paramMap.pipe(
        switchMap(params => this.categoryService.getById(+params.get('id')))
      ).subscribe(
        (category) => {
          this.category = category;
          this.categoryForm.patchValue(category); // binds loaded category data to Category form
        },
        (error) => alert('something got wrong')
      );
    }
  }

  private setPageTitle() {
    if (this.currentAction === 'new') {
      this.pageTitle = 'new category';
    } else {
      const categoryName = this.category.name || '';
      this.pageTitle = `Editing category: ${categoryName}`;
    }
  }

  private createCategory() {
    const category = Object.assign(new Category(), this.categoryForm.value);
    this.categoryService.create(category)
    .subscribe(
      category => this.actionsForSuccess(category),
      error => this.actionsForError(error)
    );
  }

  private updateCategory() {
    const category = Object.assign(new Category(), this.categoryForm.value);
    this.categoryService.update(category)
    .subscribe(
      category => this.actionsForSuccess(category),
      error => this.actionsForError(error)
    );
  }

  private actionsForSuccess(category: Category){
    toastr.success('successfuly saved');

    // redirec/reload component pages
    this.router.navigateByUrl('categories',{skipLocationChange: true}).then(
      () => this.router.navigate(['categories',category.id, 'edit'])
    );
  }

  private actionsForError(error){
    toastr.error('ops, something got wrong');
    this.submittingForm = false;

    if(error.status === 422) {
      this.serverErrorMessages = JSON.parse(error._body).errors;
    } else {
      this.serverErrorMessages = ['Ops this server is busy or something got wrong.. try again later!'];
    }
  }

}
