import { Component, OnInit } from '@angular/core';
import { Entry } from '../shared/entry.model';
import { EntryService } from '../shared/entry.service';

import { BaseResourceListComponent } from '../../../shared/components/base-resource-list.component/base-resource-list.component';


@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.scss']
})
export class EntryListComponent extends BaseResourceListComponent<Entry> {

  entries: Entry[] = [];
  constructor(private entryService: EntryService) { super(entryService); }

}
