// ------------------------------------------------------------------------------
// ----- projectsite.component --------------------------------------------------
// ------------------------------------------------------------------------------

// copyright:   2016 WiM - USGS
//
// authors:  Tonia Roddick USGS Wisconsin Internet Mapping             
//
// purpose: shell for this project's sites (add, edit, delete). contains siteList and siteSpreadsheet

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { IFullproject } from "app/shared/interfaces/projects/fullProject.interface";
import { IFullsite } from "app/shared/interfaces/projects/fullSite.interface";

@Component({
  template:`
    <h2>Project Sites</h2>
    <div>
      <div>A site: {{projectSites[0].latitude}}
      <a [routerLink]="['sitelist']" routerLinkActive="active">Site List</a>
      <a [routerLink]="['siteSpreadsheet']" routerLinkActive="active">Site Spreadsheet</a>
    </div>
    <router-outlet></router-outlet>`//<router-outlet name="createEditpopup"></router-outlet> accessed thru <a [routerLink]="[{ outlets: { createEditpopup: ['pathname'] } }]">Contact</a>
})
export class ProjectsiteComponent implements OnInit {
  public projectSites: Array<IFullsite>;
  private dataSubscript;

  constructor(private _route: ActivatedRoute) { }

  ngOnInit() {
    this.dataSubscript = this._route.parent.data.subscribe((data: { projectSites: Array<IFullsite> }) => {
      this.projectSites = data.projectSites
    });
   }
   ngOnDestroy(){
      this.dataSubscript.unsubscribe();
   }
}
