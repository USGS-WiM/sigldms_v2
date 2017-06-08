// ------------------------------------------------------------------------------
// ----- projectcontact.component -----------------------------------------------
// ------------------------------------------------------------------------------

// copyright:   2016 WiM - USGS
//
// authors:  Tonia Roddick USGS Wisconsin Internet Mapping             
//
// purpose: information on this project's contacts (add, edit, delete)

import { Component, OnInit } from '@angular/core';
import { IContactresource } from "app/shared/interfaces/projects/contactresource.interface";
import { ProjectdetailService } from "app/projectdetail/projectdetail.service";
import { IFullproject } from "app/shared/interfaces/projects/fullProject.interface";
import { ActivatedRoute } from "@angular/router";

@Component({
  template:`
    <h2>Project Contacts</h2>
    <form #projContactForm="ngForm">
      <div *ngFor="let c of projectContacts">
        <div>
          <label class="title">Name:</label>
          <span style="width:25em;">{{ c.name }}</span>
        </div>
        <div>
            <label class="title">Email:</label>
            <span style="width:25em;">{{ c.email || '' }}</span>
        </div>
        <div>
            <label class="title">Phone:</label>
            <span style="width:25em;">{{ c.phone || '' }}</span>
        </div>

        <br>
        <span>{{c.OrgName}}<em *ngIf="c.DivName">, {{c.DivName}}</em><em *ngIf="c.SecName">, {{c.SecName}}</em></span>
      </div>
    </form>
    `
})
export class ProjectcontactComponent {//} implements OnInit {
  public componentName: string;
  public projectContacts: Array<IContactresource>;
  private dataSubscript;

  constructor( private _projectDetService: ProjectdetailService, private _route: ActivatedRoute) { }

  ngOnInit() { 
    this.dataSubscript = this._route.parent.data.subscribe((data: { fullProject: IFullproject }) => {
      this.projectContacts = data.fullProject.Contacts;       
    });
    this.componentName = "projContacts";
    
  }

  //make sure phone is formatted

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
