import { OnInit } from '@angular/core';
import { BaseResourceModel } from '../../models/base-resource.model';
import { BaseResourceService } from '../../services/base-resource.service';

export abstract class BaseResourceListComponent<T extends BaseResourceModel> implements OnInit {

  constructor(
    protected resourceService: BaseResourceService<T>,
    public resources: T[]
  ) { }

  ngOnInit() {
    this.resourceService.getAll().subscribe(
      res => this.resources = res,
      error => alert('something get wrong')
    );
  }

  deleteResource(resource: T) {
    const mustDelete = confirm('Are you sure?');
    if (mustDelete) {
      this.resourceService.delete(resource.id).subscribe(
        () => this.resources = this.resources.filter(el => el !== resource),
        () => alert('something get wrong')
      );
    }
  }

}
