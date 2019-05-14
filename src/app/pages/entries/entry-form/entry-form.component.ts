import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { switchMap, toArray } from 'rxjs/operators';
import toastr from 'toastr';
import { Entry } from '../shared/entry.model';
import { EntryService } from '../shared/entry.service';
@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.scss']
})
export class EntryFormComponent implements OnInit, AfterContentChecked {

  currentAction: string;
  entryForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm = false;

  entry: Entry = new Entry();
  constructor(
    private entryService: EntryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.setCurrentAction();
    this.buildEntryForm();
    this.loadEntry();
  }


  ngAfterContentChecked(): void {
    this.setPageTitle();
  }

  submitForm(){
    if (this.currentAction === 'new') {
      this.createEntry();
    } else  {
      this.updateEntry();
    }
  }

  private setCurrentAction() {
    if (this.route.snapshot.url[0].path === 'new') {
      this.currentAction = 'new';
    } else {
      this.currentAction = 'edit';
    }
  }

  private buildEntryForm() {
    this.entryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null]
    });
  }

  private loadEntry() {
    if (this.currentAction === 'edit') {
      this.route.paramMap.pipe(
        switchMap(params => this.entryService.getById(+params.get('id')))
      ).subscribe(
        (entry) => {
          this.entry = entry;
          this.entryForm.patchValue(entry); // binds loaded entry data to Entry form
        },
        (error) => alert('something got wrong')
      );
    }
  }

  private setPageTitle() {
    if (this.currentAction === 'new') {
      this.pageTitle = 'new entry';
    } else {
      const entryName = this.entry.name || '';
      this.pageTitle = `Editing entry: ${entryName}`;
    }
  }

  private createEntry() {
    const entry = Object.assign(new Entry(), this.entryForm.value);
    this.entryService.create(entry)
    .subscribe(
      entry => this.actionsForSuccess(entry),
      error => this.actionsForError(error)
    );
  }

  private updateEntry() {
    const entry = Object.assign(new Entry(), this.entryForm.value);
    this.entryService.update(entry)
    .subscribe(
      entry => this.actionsForSuccess(entry),
      error => this.actionsForError(error)
    );
  }

  private actionsForSuccess(entry: Entry){
    toastr.success('successfuly saved');

    // redirec/reload component pages
    this.router.navigateByUrl('entries',{skipLocationChange: true}).then(
      () => this.router.navigate(['entries',entry.id, 'edit'])
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
