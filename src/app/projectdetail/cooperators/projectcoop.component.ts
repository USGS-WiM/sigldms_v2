// ------------------------------------------------------------------------------
// ----- projectcoop.component --------------------------------------------------
// ------------------------------------------------------------------------------

// copyright:   2016 WiM - USGS
//
// authors:  Tonia Roddick USGS Wisconsin Internet Mapping             
//
// purpose: information on this project's cooperators (add, delete)

import { Component, OnInit } from '@angular/core';
import { ProjectdetailService } from "app/projectdetail/projectdetail.service";
import { IOrganizationresource } from "app/shared/interfaces/projects/orgresource.interface";
import { ActivatedRoute } from "@angular/router";
import { IFullproject } from "app/shared/interfaces/projects/fullProject.interface";

@Component({
  template:`
    <h2>Project Cooperators</h2>
    <div *ngFor="let coop of projectCoops">{{coop.OrganizationName}}<br /></div>`
})
export class ProjectcooperatorComponent implements OnInit {
  public projectCoops: Array<IOrganizationresource>;
  public componentName: string;
  private dataSubscript;

  constructor(private _projectDetService: ProjectdetailService, private _route: ActivatedRoute) { }

  ngOnInit() { 
    this.dataSubscript = this._route.parent.data.subscribe((data: { fullProject: IFullproject }) => {
      this.projectCoops = data.fullProject.Organizations;       
    });
    this.componentName = "projCoop"; 
  }

  ngOnDestroy() {
      // Clean up to avoid memory leak. unsubscribe from all stuff
      this.dataSubscript.unsubscribe()
      
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
