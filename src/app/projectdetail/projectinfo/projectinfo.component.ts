// ------------------------------------------------------------------------------
// ----- projectinfo.component --------------------------------------------------
// ------------------------------------------------------------------------------

// copyright:   2016 WiM - USGS
// authors:  Tonia Roddick USGS Wisconsin Internet Mapping
// purpose: information on this project's information (edit, delete)

import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { IindexProject } from "app/shared/interfaces/projects/indexProject.interface";
import { ProjectdetailService } from "app/projectdetail/projectdetail.service";
import { IProject } from "app/shared/interfaces/projects/project.interface";
import { IFullproject } from "app/shared/interfaces/projects/fullProject.interface";
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { IProjDuration } from "app/shared/interfaces/lookups/projduration.interface";
import { LookupsService } from "app/shared/services/lookups.service";
import { IProjStatus } from "app/shared/interfaces/lookups/projstatus.interface";
import { IObjective } from "app/shared/interfaces/lookups/objective.interface";
import { IKeyword } from "app/shared/interfaces/lookups/keyword.interface";
import { IMonitorCoord } from "app/shared/interfaces/lookups/monitorcoord.interface";

@Component({
  templateUrl: "projectinfo.component.html"
})

export class ProjectinfoComponent {
  private fullProj: IFullproject;
  public project: IProject;  
  // public projName: string;
  // public showProjectInfoModal: boolean;
  public DurationList: Array<IProjDuration>;
  public StatusList: Array<IProjStatus>;
  public ProjectParts: any;
  public ProjectObjectives: Array<IObjective>;
  public ProjectMonitors: Array<IMonitorCoord>;
  public ProjectKeywords: Array<IKeyword>;
  public ProjectMonitorCoords: Array<IMonitorCoord>
  public urls: Array<string>;
  // public testCloseResult: any;
  //subscriptions
  private dataSubscript;
  private durationSubscript;
  private statSubscript;
  private objsSubscript;
  private monSubscript;
  private keysSubscript;  
  private projSubscript;
  private putProjsubscript;

  constructor(private _route: ActivatedRoute, private _router: Router,
    private _projDetService: ProjectdetailService, private _lookupServices: LookupsService) { }
    
  ngOnInit() {
    this._projDetService.setProjectInfoModal(false); //start it off false so that the true below triggers listeners
    //subscribe to get the data the first time
    this.dataSubscript = this._route.parent.data.subscribe((data: { fullProject: IFullproject }) => {
      this.fullProj = data.fullProject;
      if (this.fullProj !== undefined) {
          this._projDetService.setLastEditDate(this.fullProj.last_edited_stamp);
      } else {
        //this is a new project being created
        this.fullProj = {Name: "", created_stamp: new Date()};          
      }
      this.updateAllProjectRelatedStuff(data.fullProject);
    }); // end route subscribe
    //subscribe to update the project whenever it changes (this updates all things on the project)
    this.projSubscript = this._projDetService.getFullProj().subscribe(fullProj => {
      this.fullProj = fullProj;
      if (this.fullProj !== undefined) {
          this._projDetService.setLastEditDate(this.fullProj.last_edited_stamp);
      } else {
        //this is a new project being created
        this.fullProj = {Name: "", created_stamp: new Date()};          
      }
      this.updateAllProjectRelatedStuff(fullProj);
    });
    this.durationSubscript = this._lookupServices.getProjDurations().subscribe((pd: Array<IProjDuration>) => {
          this.DurationList = pd;    
    });
    this.statSubscript = this._lookupServices.getProjStatus().subscribe((ps: Array<IProjStatus>) => {
          this.StatusList = ps;    
    });
  } // end ngOnInit

/*  ngOnDestroy() {
    // Clean sub to avoid memory leak. unsubscribe from all stuff
    this.dataSubscript.unsubscribe();
    this.durationSubscript.unsubscribe();
    this.statSubscript.unsubscribe();
    this.objsSubscript.unsubscribe();
    this.monSubscript.unsubscribe();
    this.keysSubscript.unsubscribe();
    // this.projSubscript.unsubscribe();
    if (this.putProjsubscript) this.putProjsubscript.unsubscribe();
    this.project = undefined;    
  }*/
 
  public gotoProjects(){
    this._router.navigate(['/projects']);
  }

  //edit project info button clicked
  public openProjectModal(){
    this._projDetService.setProjectInfoModal(true); //shows the modal. listener is  
  }

  // when the fullProject gets updated or just loaded, need to update all project related things (called 2x above)
  private updateAllProjectRelatedStuff(fproj){
    this.urls = [];
    // get just project if we are editing, or add 2 props if creating new
    this.project = fproj !== undefined ? 
      this._projDetService.getIprojectEntity(fproj) : 
      { created_stamp: new Date(), data_manager_id: Number(localStorage.getItem('loggedInID')) };

    this.ProjectParts = {ProjObjs: [], ProjMon: [], ProjKeys: [], ProjUrls: []};
    this.ProjectParts.ProjObjs = fproj !== undefined ? fproj.Objectives : [];
    // don't know if i need to set it here  this._projDetService.setProjObjectives(this.ProjectParts.ProjObjs);
    this.ProjectParts.ProjMon = fproj !== undefined ? fproj.MonitoringCoords: [];
    //  this._projDetService.setProjMonCoords(this.ProjectParts.ProjMon);
    if (fproj !== undefined) {
      fproj.Keywords.forEach((k) => {
        delete k.project_keywords; //don't want this in here
        this.ProjectParts.ProjKeys.push(k);
      });
    } else this.ProjectParts.ProjKeys = [];
    //   this._projDetService.setProjKeywords(this.ProjectParts.ProjKeys);
    if (this.project.url) {
      //split string into an array
      if ((this.project.url).indexOf('|') > -1) {
        this.urls = (this.project.url).split("|");
        this.ProjectParts.ProjUrls = (this.project.url).split("|");
      } else {
        this.urls[0] = this.project.url;
        this.ProjectParts.ProjUrls[0] = this.project.url;
      }
      //make sure they are formatted.. if not, format and PUT
      let needUpdating = false;
      for (let u = 0; u < this.urls.length; u++) {
        if (!this.urls[u].startsWith('http')) {
          needUpdating = true;
          this.urls[u] = 'http://' + this.urls[u];
        }
      }
      //if they needed updating, PUT the project
      if (needUpdating) {
        this.project.url = (this.urls).join('|');
        this.putProjsubscript = this._projDetService.putProject(this.project.project_id, this.project).subscribe((r: IProject) => {
            this.project = r;
            //split string into an array
            if ((this.project.url).indexOf('|') > -1) {
                this.urls = (this.project.url).split("|");
            } else {
                this.urls[0] = this.project.url;
            }
            this.fullProj.ProjectWebsite = r.url;
            this._projDetService.setFullProject(this.fullProj);                
        });
      }
    } //end there's a url
  }
}
