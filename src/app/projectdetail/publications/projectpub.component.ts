// ------------------------------------------------------------------------------
// ----- projectpub.component -----------------------------------------------
// ------------------------------------------------------------------------------

// copyright:   2016 WiM - USGS
//
// authors:  Tonia Roddick USGS Wisconsin Internet Mapping             
//
// purpose: information on this project's publications (add, edit, delete)

import { Component, OnInit } from '@angular/core';
import { IPublication } from "app/shared/interfaces/projects/publication.interface";
import { ProjectdetailService } from "app/projectdetail/projectdetail.service";
import { ActivatedRoute } from "@angular/router";
import { IFullproject } from "app/shared/interfaces/projects/fullProject.interface";

@Component({
  template:`
    <h2>Project Publications</h2>
    <div *ngFor="let pub of projectPublications">
      <div>
          <label class="title">Title:</label>
          <span>{{ p.title || '' }}</span>
      </div>
      <div>
          <label class="title">Description:</label>
          <span>{{ p.description || '' }}</span>
      </div>
      <div>
          <label class="title">Website or location:</label>
          <span>{{ p.url || '' }}</span>
      </div>
    </div>`
})
export class ProjectpublicationComponent implements OnInit {
  public componentName: string;
  public projectPublications: Array<IPublication>;
  constructor(private _projectDetService: ProjectdetailService, private _route: ActivatedRoute) { }

  ngOnInit() { 
    this._route.parent.data.subscribe((data: { fullProject: IFullproject }) => {
      this.projectPublications = data.fullProject.Publications;       
    });
    this.componentName = "ProjPubs"; 
  
  }

  public canDeactivate(): Promise<boolean> | boolean {
    // Allow synchronous navigation (`true`) if no crisis or the crisis is unchanged
    // if (!this.crisis || this.crisis.name === this.editName) {
      return true;
    // }
      // Otherwise ask the user with the dialog service and return its
      // promise which resolves to true or false when the user decides
    // return this.dialogService.confirm('Discard changes?');
  }
}
