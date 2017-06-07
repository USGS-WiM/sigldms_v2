// ------------------------------------------------------------------------------
// ----- projectlist.module -----------------------------------------------------
// ------------------------------------------------------------------------------

// copyright:   2016 WiM - USGS
//
// authors:  Tonia Roddick USGS Wisconsin Internet Mapping             
//
// purpose: module for the projectlist 

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProjectlistComponent } from "app/projectlist/projectlist.component";
import { ProjectListRoutingModule } from "app/projectlist/projectlist-routing.module";
import { ProjectlistService } from "app/projectlist/projectlist.service";
import { ProjectListResolve } from "app/projectlist/projectList.resolve";
import { ProjectdetailModule } from "app/projectdetail/projectdetail.module";
import { SharedModule } from "app/shared/shared.module";

@NgModule({
  imports: [ CommonModule, FormsModule, SharedModule, ProjectdetailModule, ProjectListRoutingModule],
  declarations: [ProjectlistComponent],
  exports: [ProjectlistComponent],
  providers: [ProjectlistService, ProjectListResolve]
})

export class ProjectlistModule { }
