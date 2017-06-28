// ------------------------------------------------------------------------------
// ----- projectlist.resolve ----------------------------------------------------
// ------------------------------------------------------------------------------

// copyright:   2016 WiM - USGS
//
// authors:  Tonia Roddick USGS Wisconsin Internet Mapping             
//
// purpose: resolver to get the indexProjects when route is navigated to

import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { ProjectlistService } from "app/projectlist/projectlist.service";
import { IindexProject } from "app/shared/interfaces/projects/indexProject.interface";
import { LookupsService } from "app/shared/services/lookups.service";

@Injectable()
export class ProjectListResolve implements Resolve<Array<IindexProject>> {

  constructor(private _projectListService: ProjectlistService) {}

  resolve() {
    return this._projectListService.getFullProject();
  }
}