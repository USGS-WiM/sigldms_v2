// ------------------------------------------------------------------------------
// ----- projectsitesheet.component ---------------------------------------------
// ------------------------------------------------------------------------------

// copyright:   2016 WiM - USGS
//
// authors:  Tonia Roddick USGS Wisconsin Internet Mapping             
//
// purpose: information on this project's sites (in an excel-like table)

import { Component, OnInit } from '@angular/core';

@Component({
  template:`
    <h2>Site Spreadsheet</h2>`
})
export class ProjectsitespreadsheetComponent implements OnInit {
  public componentName: string;
  constructor() { }

  ngOnInit() { this.componentName = "SiteSpreadsheet"; }

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
