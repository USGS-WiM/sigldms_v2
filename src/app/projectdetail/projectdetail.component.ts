// ------------------------------------------------------------------------------
// ----- projectdetail.component ------------------------------------------------
// ------------------------------------------------------------------------------

// copyright:   2016 WiM - USGS
//
// authors:  Tonia Roddick USGS Wisconsin Internet Mapping             
//
// purpose: shell for all the project's details (info, contacts, data, cooperators, publications, and sites)

import { Component, OnInit, ViewChild } from '@angular/core';
import { IFullproject } from "app/shared/interfaces/projects/fullProject.interface";
import { ActivatedRoute } from "@angular/router";
import { ProjectdetailService } from "app/projectdetail/projectdetail.service";
import { IFullsite } from "app/shared/interfaces/projects/fullSite.interface";
import { IDatahost } from "app/shared/interfaces/projects/datahost.interface";
import { IPublication } from "app/shared/interfaces/projects/publication.interface";
import { LookupsService } from "app/shared/services/lookups.service";
import { DialogService } from "app/shared/services/dialog.service";
import { IProject } from "app/shared/interfaces/projects/project.interface";
import { AreYouSureModal } from "app/shared/components/areYouSure.modal";
// import { ModalDirective } from "ngx-bootstrap/modal";

@Component({
  template:`
      <div id="body-wrapper" class="sigl-section">
        <div class="edit-section-heading">
          {{fullProject.Name}}
          <div id="edit-publish-buttons">
            <h4>Project published on SiGL Mapper?</h4>
            <switch [status]="switchStatus" [onText]="'Yes'" [offText]="'No'" [onColor]="'sky-blue'" [offColor]="'default'" [size]="'normal'" (statusChange)="onFlagChange($event)"></switch>
          </div>
        </div>
        <div id="sigl-edit-left">
          <a [routerLink]="['info']" routerLinkActive="active">Project Information</a>
          <a [routerLink]="['cooperators']"  routerLinkActive="active">Organizations<span class="badge badge-pill badge-default pull-right">{{fullProject?.Organizations?.length}}</span></a>
          <a [routerLink]="['data']" routerLinkActive="active">Data Sources<span class="badge badge-pill badge-default pull-right">{{datahosts?.length}}</span></a>
          <a [routerLink]="['contacts']" routerLinkActive="active">Contacts<span class="badge badge-pill badge-default pull-right">{{fullProject?.Contacts?.length}}</span></a>
          <a [routerLink]="['publications']" routerLinkActive="active">Publications<span class="badge badge-pill badge-default pull-right">{{publications?.length}}</span></a>
          <a [routerLink]="['sites/sitelist']" routerLinkActive="active" id="siteTab">Sites<span class="badge badge-pill badge-default pull-right">{{fullSites?.length}}</span></a>
          
          <span>Created: {{(fullProject.created_stamp | date: 'MM/dd/yyyy' || '---') | date: 'MM/dd/yyyy'}}</span> <br />
          <span>Last Edited: {{(lastEdited | date: 'MM/dd/yyyy' || '---') | date: 'MM/dd/yyyy'}}</span>
        </div>
        
        <div id="sigl-edit-right">
          <router-outlet></router-outlet>
        </div>
      </div>
      <areYouSureModal #areYouSure [message]="messageToShow" (modalResponseEvent)="AreYouSureDialogResponse($event)"></areYouSureModal>`,
  styleUrls: ['./projectdetail.component.css', '../app.component.css'], 
  providers: []
})

export class ProjectdetailComponent implements OnInit { 
  @ViewChild('areYouSure') areYouSure: AreYouSureModal;
  public switchStatus: boolean;
  public createdStamp: Date;
  public lastEdited: Date;
  public fullProject: IFullproject;
  public fullSites: Array<IFullsite>;
  public datahosts: Array<IDatahost>;
  public publications: Array<IPublication>;
  private flaggingBool: boolean; //updates when they change switch

  constructor(private _route: ActivatedRoute, private _projectDetService: ProjectdetailService, private _lookupService: LookupsService, private _dialogService: DialogService,){}
  
  ngOnInit(){    
    
    this._dialogService.setMessage("Are you sure this project is ready to publish on the SiGL Mapper?");
 //     this._dialogService.setAreYouSureModal(false);
    //go populate the rest of the dropdowns
    if (localStorage.getItem('creds') !== null)
    //  this._lookupService.getLookups();
    // needed to keep count updated
    this._projectDetService.projData().subscribe((d: Array<IDatahost>) => {
      this.datahosts = d;
    });
    // needed to keep count updated
    this._projectDetService.projPublications().subscribe((p: Array<IPublication>) => {
      this.publications = p;
    });
    // needed to keep last_updated date updated
    this._projectDetService.lastEditDate.subscribe((d: Date) => {
      this.lastEdited = d;
    });

    // routed here, populate project and sites
    this._route.data.subscribe((data: { fullProject: IFullproject }) => {
        this.fullProject = data.fullProject;  
        if (this.fullProject !== undefined) {
          this._projectDetService.setLastEditDate(this.fullProject.last_edited_stamp);
        } else {
          this.fullProject = {Name: "", created_stamp: new Date()};
          //this is a new project being created
        }
    });    
    this._route.data.subscribe((data: { projectSites: Array<IFullsite> }) => {
        this.fullSites = data.projectSites;
        if (this.fullSites !== undefined) {
          this.fullProject.Sites = this.fullSites;
          // go update all the stuff in the services for access throughout app
          this._projectDetService.updateProjectParts(this.fullProject);
        } else {
          // this is a new project being created
        }
        
    });
    this.switchStatus = this.fullProject.ready_flag == 1 ? true : false;
  }

  public onFlagChange(e) {
    this.flaggingBool = e;
    if (e){
      //flag ready for mapper
      this._dialogService.setMessage("Are you sure this project is ready to publish on the SiGL Mapper?");
   //   this._dialogService.setAreYouSureModal(true); //shows the modal. listener is AreYouSureDialogResponse()
      this.areYouSure.showSureModal();
    } else {
      //remove flag

    }
    this.switchStatus = !e;
    let test = this.fullProject.ready_flag;
  }
  // response from dialog (either want to flag/unflag or cancel
  public AreYouSureDialogResponse(val:boolean){
    this._dialogService.setAreYouSureModal(false);   
    //if they clicked Yes
    if (val) {
      this.switchStatus = true;
      //flag or unflag project answer in: this.flaggingBool
        // update project with flagged state
      let aProject: IProject = this.getProjectProps(this.fullProject);
      aProject.ready_flag = val ? 1 : 0;
      //now PUT it

    } else {
      //they cancelled
      this.switchStatus = false;
    }
  }

  private getProjectProps(proj){
    let project: IProject = {
      project_id: proj.ProjectId, 
      name: proj.Name, 
      proj_duration_id: proj.duration_id,
      proj_status_id: proj.status_id,
      start_date: proj.StartDate,
      end_date: proj.EndDate,
      description: proj.Description,
      additional_info: proj.AdditionalInfo,
      url: proj.ProjectWebsite,
      data_manager_id: proj.DataManagerId,
      science_base_id: proj.ScienceBaseId,
      created_stamp: proj.created_stamp,
      last_edited_stamp: new Date()
    }

    return project;
  }
}
