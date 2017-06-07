// ------------------------------------------------------------------------------
// ----- projectinfo.component --------------------------------------------------
// ------------------------------------------------------------------------------

// copyright:   2016 WiM - USGS
//
// authors:  Tonia Roddick USGS Wisconsin Internet Mapping             
//
// purpose: information on this project's information (edit, delete)

import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
// import 'rxjs/add/operator/switchMap';
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
  templateUrl: "projectinfo.component.html"//<router-outlet name="createEditpopup"></router-outlet>

})
export class ProjectinfoComponent {
  public project: IProject;  
  public projName: string;
  public showProjectInfoModal: boolean;
  public DurationList: Array<IProjDuration>;
  public StatusList: Array<IProjStatus>;
  public ProjectParts: any;
  public ProjectObjectives: Array<IObjective>;
  public ProjectMonitors: Array<IMonitorCoord>;
  public ProjectKeywords: Array<IKeyword>;
  public ProjectMonitorCoords: Array<IMonitorCoord>
  public urls: Array<string>;
  public testCloseResult: any;

  constructor(private _route: ActivatedRoute, private _router: Router,
    private _projectDetService: ProjectdetailService, private _lookupServices: LookupsService,
    private _modalService: NgbModal) { }
    
  ngOnInit() {
    this._projectDetService.setProjectInfoModal(false); //start it off false so that the true below triggers listeners
    this._route.parent.data.subscribe((data: { fullProject: IFullproject }) => {
      this.urls = [];
      this.project = data.fullProject !== undefined ? this._projectDetService.updateProjInfo(data.fullProject) : { created_stamp: new Date(), data_manager_id: Number(localStorage.getItem('loggedInID')) };
      this.ProjectParts = {ProjObjs: [], ProjMon: [], ProjKeys: [], ProjUrls: []};
      this.ProjectParts.ProjObjs = data.fullProject !== undefined ? data.fullProject.Objectives : [];
      this.ProjectParts.ProjMon = data.fullProject !== undefined ? data.fullProject.MonitoringCoords: [];
      if (data.fullProject !== undefined) {
        data.fullProject.Keywords.forEach((k) => {
          delete k.project_keywords; //don't want this in here
          this.ProjectParts.ProjKeys.push(k);
        });

      } else this.ProjectParts.ProjKeys = [];
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
        let neededUpdating1 = false;
        for (let u = 0; u < this.urls.length; u++) {
          if (!this.urls[u].startsWith('http')) {
            neededUpdating1 = true;
            this.urls[u] = 'http://' + this.urls[u];
          }
        }
        //if they needed updating, PUT the project
        if (neededUpdating1) {
         /* $http.defaults.headers.common.Authorization = 'Basic ' + $cookies.get('siGLCreds');
          $http.defaults.headers.common.Accept = 'application/json';
          $scope.aProject.url = ($scope.urls).join('|');
          PROJECT.update({ id: $scope.aProject.project_id }, $scope.aProject).$promise.then(function (response) {
              $scope.aProject = response;
              //split string into an array
              if (($scope.aProject.url).indexOf('|') > -1) {
                  $scope.urls = ($scope.aProject.url).split("|");
              } else {
                  $scope.urls[0] = $scope.aProject.url;
              }
          });*/
        }
      } //end there's a url
    }); // end route subscribe
    
    this._lookupServices.getProjDurations().subscribe((pd: Array<IProjDuration>) => {
          this.DurationList = pd;    
    });
    this._lookupServices.getProjStatus().subscribe((ps: Array<IProjStatus>) => {
          this.StatusList = ps;    
    });
    //get projectObjectives
    if (this.project.project_id) {
      this._projectDetService.getProjectObjectives(this.project.project_id);
      this._projectDetService.getProjectKeywords(this.project.project_id);
      this._projectDetService.getProjectMonitorCoords(this.project.project_id);
    }
    //subscribe to the get values
    this._projectDetService.projectObjectives.subscribe(projO => { this.ProjectObjectives = projO; });
    this._projectDetService.projMonCoords.subscribe(projM => { this.ProjectMonitorCoords = projM;});
    this._projectDetService.projKeywords.subscribe(projK => { this.ProjectKeywords = projK;});
  /*  if (this.project.project_id == undefined)
      this.openProjectModal("new");*/
  }

  ngOnDestroy() {
    // Clean sub to avoid memory leak
    //this.sub.unsubscribe();
  }
 
  public gotoProjects(){
    this._router.navigate(['/projects']);
  }
  //edit project info button clicked
  public openProjectModal(editProject){
    this._projectDetService.setProjectInfoModal(true); //shows the modal. listener is  
 }
 private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
}
