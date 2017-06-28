// ------------------------------------------------------------------------------
// ----- projectcoop.component --------------------------------------------------
// ------------------------------------------------------------------------------

// copyright:   2016 WiM - USGS
//
// authors:  Tonia Roddick USGS Wisconsin Internet Mapping             
//
// purpose: information on this project's cooperators (add, delete)

import { Component, OnInit, ViewChild } from '@angular/core';
import { ProjectdetailService } from "app/projectdetail/projectdetail.service";
import { IOrganizationresource } from "app/shared/interfaces/projects/orgresource.interface";
import { ActivatedRoute } from "@angular/router";
import { IFullproject } from "app/shared/interfaces/projects/fullProject.interface";
import { OrganizationModal } from "app/shared/components/organization.modal";
import { LookupsService } from "app/shared/services/lookups.service";
import { IDivision } from "app/shared/interfaces/lookups/division.interface";
import { ISection } from "app/shared/interfaces/lookups/section.interface";
import { IOrganization } from "app/shared/interfaces/lookups/organization.interface";

@Component({
  templateUrl: 'projectcoop.component.html'
})
export class ProjectcooperatorComponent implements OnInit {
  @ViewChild('orgModal') organizationModal: OrganizationModal;
  public projectCoops: Array<IOrganizationresource>;
  public componentName: string;
  private dataSubscript;
  private divisionList: Array<IDivision>;
  private sectionList: Array<ISection>;
  private orgList: Array<IOrganization>;
  public orgs: Array<IOrganization>;

  constructor(private _projDetService: ProjectdetailService, private _lookupService: LookupsService, private _route: ActivatedRoute) { }

  ngOnInit() { 
    this.dataSubscript = this._route.parent.data.subscribe((data: { fullProject: IFullproject }) => {
      this.projectCoops = data.fullProject.Organizations;       
    });
    this._lookupService.Divisions.subscribe((d:Array<IDivision>) => {
      this.divisionList = d;
    });
    this._lookupService.Sections.subscribe((s:Array<ISection>) => {
      this.sectionList = s;
    });
    this._lookupService.Orgs.subscribe((o:Array<IOrganization>) => {
      this.orgList = o;
    });
    this.componentName = "projCoop"; 
  }

  public showOrgModal(){
    this.organizationModal.showOrgModal();
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
