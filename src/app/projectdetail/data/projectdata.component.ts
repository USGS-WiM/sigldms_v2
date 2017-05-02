// ------------------------------------------------------------------------------
// ----- projectdata.component -----------------------------------------------
// ------------------------------------------------------------------------------

// copyright:   2016 WiM - USGS
//
// authors:  Tonia Roddick USGS Wisconsin Internet Mapping             
//
// purpose: information on this project's data hosts (add, edit, delete)

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ProjectdetailService } from "app/projectdetail/projectdetail.service";
import { IDatahost } from "app/shared/interfaces/projects/datahost.interface";
import { ActivatedRoute, Router } from "@angular/router";
import { IFullproject } from "app/shared/interfaces/projects/fullProject.interface";
import { DialogService } from "app/shared/services/dialog.service";

// import { NewDataComponent } from './newdatahost.component';

@Component({
  templateUrl: "projectdata.component.html",
  styleUrls: ['./projectdata.component.css'], 
})
export class ProjectdataComponent implements OnInit {
  @ViewChild('DataEditForm') DataEditForm;

  public componentName: string;
  public projectId: number;
  public projectData: Array<IDatahost>;
  public neededUpdating: boolean; // if the url isn't formatted, flag so know to PUT it after fixing
  public isEditing: boolean;
  private tempData: IDatahost;
  public errorFlag: boolean;
  public rowBeingEdited: number;
  public nextURL: string;

  constructor(private _projectDetService: ProjectdetailService, private _dialogService: DialogService, private _route: ActivatedRoute, public _router: Router) { 
    this.errorFlag = false; // this keeps the showReqModal() subscription from firing twice and showing 2 modals
  }

  ngOnInit() { 
    this.componentName = "ProjData";
    this.neededUpdating = false; this.rowBeingEdited = -1; //start it off neg  
    this._route.parent.data.subscribe((data: { fullProject: IFullproject }) => {
      this.projectData = data.fullProject.DataHosts;    
      this.projectId = data.fullProject.ProjectId;
      // if any ProjDatum, make sure the url (if one) is formatted properly
      for (var pdu = 0; pdu < this.projectData.length; pdu++) {
          var ind = pdu;
          this.projectData[ind].isEditing = false;
          if (this.projectData[ind].portal_url !== undefined && !this.projectData[ind].portal_url.startsWith('http')) {
              //there is a url and it's not formatted
              this.neededUpdating = true;
              this.projectData[ind].portal_url = 'http://' + this.projectData[ind].portal_url;
            /*  $http.defaults.headers.common.Authorization = 'Basic ' + $cookies.get('siGLCreds');
              $http.defaults.headers.common.Accept = 'application/json';
              DATA_HOST.update({ id: $scope.ProjData[ind].data_host_id }, $scope.ProjData[ind]).$promise; */
          }
      }
    });
    this._projectDetService.projData().subscribe((d: Array<IDatahost>) => {
      this.projectData = d;
    });
    this._dialogService.nextUrl.subscribe((s:any) => {
      this.nextURL = s;
    });
  } // end ngOnInit()

  // want to edit
  public EditRowClicked(i:number) {
    this.rowBeingEdited = i;
    this.tempData = Object.assign({}, this.projectData[i]); // make a copy in case they cancel
    this.projectData[i].isEditing = true;    
    this.isEditing = true; // set to true so create new is disabled
  }

  // nevermind editing
  public CancelEditRowClicked(i:number) {
    this.projectData[i] = Object.assign({}, this.tempData);
    this.projectData[i].isEditing = false;
    this.rowBeingEdited = -1;
    this.isEditing = false; // set to true so create new is disabled
    if (this.DataEditForm.form.dirty) this.DataEditForm.reset();
  }

  // edits made, save clicked
  public saveDatahost(d: IDatahost, i:number) {
    if ((d.description == undefined || d.description == "") && 
        (d.portal_url == "" || d.portal_url == "http://" || d.portal_url == undefined) &&
        (d.host_name == undefined || d.host_name == "")) {
      this.ShowRequiredModal(true);
    } else {      
      delete d.isEditing;
      this._projectDetService.putDatahost(d.data_host_id, d, i).subscribe((r: IDatahost) => {
        //  alert("data host updated");
        r.isEditing = false;
        this.projectData[i] = r;
        this._projectDetService.setProjectData(this.projectData);
        this.rowBeingEdited = -1;
        this.isEditing = false; // set to true so create new is disabled
        if (this.DataEditForm.form.dirty) this.DataEditForm.reset();
      });
    }
  }
  public ShowRequiredModal(s:any){    
    this._dialogService.setAtLeast1Modal(false); // need to reset it first
  //  this.errorFlag = true;
    this._dialogService.setAtLeast1Modal(true);
  }
  // create new data host
  public AddDataHost(d: IDatahost){
    d.project_id = this.projectId;
    this._projectDetService.postDatahost(d);
    alert("data host added");
  }
  public StayOrGo(val:boolean){
    this._dialogService.setAreYouSureModal(false);    
    if (val) {
      // it's ok to leave here without saving
      this.CancelEditRowClicked(this.rowBeingEdited); // clear out what they've done
      this._router.navigate([this.nextURL]);
    }

  }
  // did they make a change and not save?
  public canDeactivate(nextUrl): Promise<boolean> | boolean {    
    this._dialogService.setAreYouSureModal(false); // make sure this is false first so it fires
    
    if (this.DataEditForm.form.dirty) {
      this._dialogService.setAreYouSureModal(true);
    } else {
      return true;
    }
  }  
}

