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
// import { ModalDirective } from "ngx-bootstrap/modal";

@Component({
  template:`
      <div id="body-wrapper" class="sigl-section">
        <div class="edit-section-heading">{{fullProject.Name}}</div>
        <div id="sigl-edit-left">
          <a [routerLink]="['info']" routerLinkActive="active">Project Information</a>
          <a [routerLink]="['cooperators']"  routerLinkActive="active">Organizations<span class="badge badge-pill badge-default pull-right">{{fullProject.Organizations.length}}</span></a>
          <a [routerLink]="['data']" routerLinkActive="active">Data Sources<span class="badge badge-pill badge-default pull-right">{{datahosts.length}}</span></a>
          <a [routerLink]="['contacts']" routerLinkActive="active">Contacts<span class="badge badge-pill badge-default pull-right">{{fullProject.Contacts.length}}</span></a>
          <a [routerLink]="['publications']" routerLinkActive="active">Publications<span class="badge badge-pill badge-default pull-right">{{publications.length}}</span></a>
          <a [routerLink]="['sites/sitelist']" routerLinkActive="active" id="siteTab">Sites<span class="badge badge-pill badge-default pull-right">{{fullSites.length}}</span></a>
          <span>Created: {{(fullProject.created_stamp | date: 'MM/dd/yyyy' || '---') | date: 'MM/dd/yyyy'}}</span> <br />
          <span>Last Edited: {{(fullProject.last_edited_stamp | date: 'MM/dd/yyyy' || '---') | date: 'MM/dd/yyyy'}}</span>
        </div>
        
        <div id="sigl-edit-right">
          <router-outlet></router-outlet>
        </div>
      </div>`,
  styleUrls: ['./projectdetail.component.css', '../app.component.css'], 
  providers: []
})

export class ProjectdetailComponent implements OnInit{ 
  public createdStamp: Date;
  public lastEdited:Date;
  public fullProject: IFullproject;
  public fullSites: Array<IFullsite>;
  public datahosts: Array<IDatahost>;
  public publications: Array<IPublication>;
  constructor(private _route: ActivatedRoute, private _projectDetService: ProjectdetailService){}
  
  ngOnInit(){
    // needed to keep count updated
    this._projectDetService.projData().subscribe((d: Array<IDatahost>) => {
      this.datahosts = d;
    });
    // needed to keep count updated
    this._projectDetService.projPublications().subscribe((p: Array<IPublication>) => {
      this.publications = p;
    });
    this._route.data.subscribe((data: { fullProject: IFullproject }) => {
        this.fullProject = data.fullProject;
        
    });
    this._route.data.subscribe((data: { projectSites: Array<IFullsite> }) => {
        this.fullSites = data.projectSites;
        this.fullProject.Sites = this.fullSites;
        // go update all the stuff in the services for access throughout app
        this._projectDetService.updateProjectParts(this.fullProject);
    });
  // if (localStorage.getItem('creds') !== null)

  }
}
