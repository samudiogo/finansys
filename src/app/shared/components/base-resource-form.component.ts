import { OnInit, AfterContentChecked, Injector } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import toastr from 'toastr';

import { BaseResourceModel } from '../../shared/models/base-resource.model';
import { BaseResourceService } from '../../shared/services/base-resource.service';

export abstract class BaseResourceFormComponent<T extends BaseResourceModel> implements OnInit, AfterContentChecked {

    currentAction: string;
    resourceForm: FormGroup;
    pageTitle: string;
    serverErrorMessages: string[] = null;
    submittingForm = false;
    protected route: ActivatedRoute;
    protected router: Router;
    protected formBuilder: FormBuilder;


    constructor(
        protected injector: Injector,
        public resource: T,
        protected resourceService: BaseResourceService<T>,
        protected jsonDataToResourceFn: (jsonData: any) => T

    ) {
        this.route = injector.get(ActivatedRoute);
        this.router = injector.get(Router);
        this.formBuilder = injector.get(FormBuilder);

    }

    ngOnInit() {
        this.setCurrentAction();
        this.buildResourceForm();
        this.loadResource();
    }


    ngAfterContentChecked(): void {
        this.setPageTitle();
    }

    submitForm() {
        if (this.currentAction === 'new') {
            this.createResource();
        } else {
            this.updateResource();
        }
    }

    protected setCurrentAction() {
        if (this.route.snapshot.url[0].path === 'new') {
            this.currentAction = 'new';
        } else {
            this.currentAction = 'edit';
        }
    }

    protected loadResource() {
        if (this.currentAction === 'edit') {
            this.route.paramMap.pipe(
                switchMap(params => this.resourceService.getById(+params.get('id')))
            ).subscribe(
                (resource) => {
                    this.resource = resource;
                    this.resourceForm.patchValue(resource); // binds loaded resource data to resource form
                },
                () => alert('something got wrong')
            );
        }
    }

    protected setPageTitle() {
        if (this.currentAction === 'new') {
            this.pageTitle = this.creationPageTitle();
        } else {
            this.pageTitle = this.editionPageTitle();
        }
    }

    protected creationPageTitle(): string { return 'New'; }

    protected editionPageTitle(): string { return 'Edit'; }

    protected createResource() {
        const resource = this.jsonDataToResourceFn(this.resourceForm.value);
        this.resourceService.create(resource)
            .subscribe(
                resourceFromService => this.actionsForSuccess(resourceFromService),
                error => this.actionsForError(error)
            );
    }

    protected updateResource() {
        const resource = this.jsonDataToResourceFn( this.resourceForm.value);
        this.resourceService.update(resource)
            .subscribe(
                resourceFromService => this.actionsForSuccess(resourceFromService),
                error => this.actionsForError(error)
            );
    }

    protected actionsForSuccess(resource: T) {

        toastr.success('successfuly saved');

        const baseComponentPath: string = this.route.snapshot.parent.url[0].path;
        // redirec/reload component pages
        this.router.navigateByUrl(baseComponentPath, { skipLocationChange: true }).then(
            () => this.router.navigate([baseComponentPath, resource.id, 'edit'])
        );
    }

    protected actionsForError(error) {
        toastr.error('ops, something got wrong');
        this.submittingForm = false;

        if (error.status === 422) {
            this.serverErrorMessages = JSON.parse(error._body).errors;
        } else {
            this.serverErrorMessages = ['Ops this server is busy or something got wrong.. try again later!'];
        }
    }

    protected abstract buildResourceForm(): void;

}
