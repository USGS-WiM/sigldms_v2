// ------------------------------------------------------------------------------
// ----- projectdetail.component ------------------------------------------------
// ------------------------------------------------------------------------------

// copyright:   2016 WiM - USGS
// authors:  Tonia Roddick USGS Wisconsin Internet Mapping
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

@Component({
  template:`
      <div id="body-wrapper" class="sigl-section">
        <div class="edit-section-heading">
          {{fullProject.Name}}
          <div id="edit-publish-buttons">
            <h4>Project published on SiGL Mapper?</h4>
            <switch [(status)]="switchStatus" [onText]="'Yes'" [offText]="'No'" [onColor]="'sky-blue'" [offColor]="'default'" [size]="'normal'" (statusChange)="onFlagChange($event)"></switch>
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
  public lastEdited: Date; // this gets updated as the project stuff is edited/created/deleted
  public fullProject: IFullproject;
  public fullSites: Array<IFullsite>;
  public datahosts: Array<IDatahost>;
  public publications: Array<IPublication>;
  public switchStatus: boolean; // used for Flag Project ready for mapper
  private flaggingBool: boolean; //updates when they change switch
  private dataSubscript;
  private pubSubscript;
  private dateSubscript;
  private projDataSubscript;
  private siteDataSubscript;
  private putProjsubscript;

  constructor(private _route: ActivatedRoute, private _projDetService: ProjectdetailService, private _lookupService: LookupsService, private _dialogService: DialogService,){}
  
  ngOnInit(){
    // needed to keep count updated
    this.dataSubscript = this._projDetService.projData().subscribe((d: Array<IDatahost>) => {
      this.datahosts = d;
    });
    // needed to keep count updated
    this.pubSubscript = this._projDetService.projPublications().subscribe((p: Array<IPublication>) => {
      this.publications = p;
    });
    // needed to keep last_updated date updated
    this.dateSubscript = this._projDetService.lastEditDate.subscribe((d: Date) => {
      this.lastEdited = d;
    });
    // routed here, populate project and sites
    this.projDataSubscript = this._route.data.subscribe((data: { fullProject: IFullproject }) => {
        this.fullProject = data.fullProject;  
        if (this.fullProject !== undefined) {
          this._projDetService.setLastEditDate(this.fullProject.last_edited_stamp);
        } else {
          //this is a new project being created
          this.fullProject = {Name: "", created_stamp: new Date()};          
        }
    });    
    this.siteDataSubscript = this._route.data.subscribe((data: { projectSites: Array<IFullsite> }) => {
        this.fullSites = data.projectSites;
        if (this.fullSites !== undefined) {
          this.fullProject.Sites = this.fullSites;          
        } else {
          // this is a new project being created
        }        
    });

    // go update all the stuff in the services for access throughout app (if editing)
    if (this.fullProject.ProjectId !== undefined) {
      this._projDetService.updateProjectParts(this.fullProject);    
      this.switchStatus = this.fullProject.ready_flag == 1 ? true : false; 
    } else this.switchStatus = false;
  } // end ngOnInit

  // they flagged the project ready/notready
  public onFlagChange(flagProject) {
    this.flaggingBool = flagProject; // store to be used after they respond to areYouSure modal
    if (flagProject) this._dialogService.setMessage("Are you sure this project is ready to publish on the SiGL Mapper?");
    else this._dialogService.setMessage("Are you sure you want to remove this project from being published on the SiGL Mapper?");
    
    this.areYouSure.showSureModal(); // listener is AreYouSureDialogResponse()  
  }

  // response from dialog (either want to flag/unflag or cancel
  public AreYouSureDialogResponse(modalResponse:boolean){
    //if they clicked Yes
    if (modalResponse) {
      // update project with flagged state
      let aProject: IProject = this._projDetService.getIprojectEntity(this.fullProject);
      aProject.last_edited_stamp = new Date(); // update with each change
      aProject.ready_flag = this.flaggingBool ? 1 : 0;
      // now PUT it
      this.putProjsubscript = this._projDetService.putProject(aProject.project_id, aProject).subscribe((r: IProject) => {
        // TODO add Toaster("Project updated");
        this.fullProject.ready_flag = r.ready_flag;        
        this._projDetService.setFullProject(this.fullProject); //sets all the things for all the listeners
        this._projDetService.setLastEditDate(new Date()); // updates the last edit date on the projDetails parent    
      });
    } else {
      //they cancelled
      this.switchStatus = !this.flaggingBool;
    }
  }  

/* not sure if I want to destroy everything  
  ngOnDestroy() {
    this.dataSubscript.unsubscribe();
    this.pubSubscript.unsubscribe();
    this.dateSubscript.unsubscribe();
    this.projDataSubscript.unsubscribe();
    this.siteDataSubscript.unsubscribe();
    this.fullProject = undefined;
    this.fullSites = undefined;
    this.datahosts = undefined;
    this.publications = undefined;
    if (this.putProjsubscript) this.putProjsubscript.unsubscribe();
  }*/
}
