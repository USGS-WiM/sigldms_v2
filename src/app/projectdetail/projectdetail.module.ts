// ------------------------------------------------------------------------------
// ----- projectdetail.module ---------------------------------------------------
// ------------------------------------------------------------------------------

// copyright:   2016 WiM - USGS
//
// authors:  Tonia Roddick USGS Wisconsin Internet Mapping             
//
// purpose: handles all the project's details (info, contacts, data, cooperators, publications, and sites)

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SwitchComponent } from 'angular2-bootstrap-switch/components';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
 
// import { NgbActiveModal, NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { ProjectdetailComponent } from "app/projectdetail/projectdetail.component";
import { ProjectinfoComponent } from "app/projectdetail/projectinfo/projectinfo.component";
import { ProjectcontactComponent } from "app/projectdetail/contacts/projectcontact.component";
import { ProjectcooperatorComponent } from "app/projectdetail/cooperators/projectcoop.component";
import { ProjectdataComponent } from "app/projectdetail/data/projectdata.component";
import { NewDataComponent } from "app/projectdetail/data/newdatahost.component";
import { ProjectsiteComponent } from "app/projectdetail/sites/projectsite.component";
import { ProjectsitelistComponent } from "app/projectdetail/sites/projectsitelist.component";
import { ProjectsitespreadsheetComponent } from "app/projectdetail/sites/projectsitesheet.component";
import { ProjectpublicationComponent } from "app/projectdetail/publications/projectpub.component";
import { NewPublicationComponent } from "app/projectdetail/publications/newpublication.component";
import { FullProjectResolve } from "app/projectdetail/fullProject.resolve";
import { ProjectSitesResolve } from "app/projectdetail/projectSites.resolve";
import { PipesModule } from "app/shared/pipes/pipes.module";
import { ProjectdetailService } from "app/projectdetail/projectdetail.service";
import { LookupsService } from "app/shared/services/lookups.service";
import { SharedModule } from "app/shared/shared.module";
import { ProjectDetailRoutingModule } from "app/projectdetail/projectdetail-routing.module";
import { EditProjectModal } from "app/projectdetail/projectinfo/projectinfo.modal";
import { ProjPartList } from "app/projectdetail/projectinfo/projectPartList.component";

@NgModule({
  imports: [ CommonModule, FormsModule, ProjectDetailRoutingModule, PipesModule, SharedModule.forRoot(), ReactiveFormsModule, BrowserAnimationsModule ],// , NgbModule ],
  declarations: [ProjectdetailComponent, ProjectinfoComponent, EditProjectModal, ProjPartList, ProjectcontactComponent, ProjectcooperatorComponent, 
                ProjectdataComponent, NewDataComponent, ProjectpublicationComponent, NewPublicationComponent, ProjectsiteComponent, 
                ProjectsitelistComponent, ProjectsitespreadsheetComponent, SwitchComponent ],
  exports: [ProjectdetailComponent],
  providers: [ProjectdetailService, FullProjectResolve, ProjectSitesResolve]
})
export class ProjectdetailModule { }
