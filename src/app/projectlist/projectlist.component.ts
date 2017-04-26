// ------------------------------------------------------------------------------
// ----- projectlist.component --------------------------------------------------
// ------------------------------------------------------------------------------

// copyright:   2016 WiM - USGS
//
// authors:  Tonia Roddick USGS Wisconsin Internet Mapping             
//
// purpose: logic for projectList page and shell for the projectdetail parts

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IindexProject } from "app/shared/interfaces/projects/indexProject.interface";

@Component({
  selector: 'app-projectlist',
  templateUrl: './projectlist.component.html',
  styleUrls: ['./projectlist.component.css', '../app.component.css']
})
export class ProjectlistComponent implements OnInit {
  public projectList: Array<IindexProject>;
  private selectedId:number;
  constructor(private _router: Router, private _route: ActivatedRoute ) { }

  ngOnInit() {
    // give me the indexProjects that were resolved in the navigate to this route
    this.projectList = this._route.snapshot.data['projectList'];   
  //  let d: any = this._lookupServices.getProjDurations(); //.subscribe((d: any) => {          
      //console.log(d);
    //});
  } // end onInit()

  public onSelect(proj: IindexProject) {
    this._router.navigate(['/projectdetail', proj.project_id]);
  }

}
