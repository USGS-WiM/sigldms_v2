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
	template: `
    <h2>Sites -- Left off here</h2>    
	<div class="site-edit-mode-wrapper"><!--A site: {{projectSites[0].latitude}}-->
		<div class="btn-group" ngbRadioGroup name="radioBasic" [(ngModel)]="siteSubPage">
			<label ngbButtonLabel class="site-edit-mode">
				<input ngbButton type="radio" [value]="single"> single site editing
			</label>
			<label ngbButtonLabel class="site-edit-mode">
				<input ngbButton type="radio" value="spreadsheet">spreadsheet mode
			</label>
		</div>
		<!--
		<a [routerLink]="['sitelist']" routerLinkActive="active">single site editing</a>
		<a [routerLink]="['siteSpreadsheet']" routerLinkActive="active">spreadsheet mode</a>
		-->
    </div>
    <span>&nbsp;&nbsp;<a (click)="showHelp()">Help</a></span>    
    <router-outlet></router-outlet>`//<router-outlet name="createEditpopup"></router-outlet> accessed thru <a [routerLink]="[{ outlets: { createEditpopup: ['pathname'] } }]">Contact</a>
})
export class ProjectsiteComponent implements OnInit {
	public projectSites: Array<IFullsite>;
	private dataSubscript;
	public siteSubPage;
	constructor(private _route: ActivatedRoute) { }

	ngOnInit() {
		this.dataSubscript = this._route.parent.data.subscribe((data: { projectSites: Array<IFullsite> }) => {
			this.projectSites = data.projectSites
		});
		this.siteSubPage = "single";
	}
	ngOnDestroy() {
		this.dataSubscript.unsubscribe();
	}
}
