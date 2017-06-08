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
import { AreYouSureModal } from "app/shared/components/areYouSure.modal";

@Component({
  templateUrl: "projectdata.component.html",
  styleUrls: ['./projectdata.component.css'], 
})
export class ProjectdataComponent implements OnInit {
  @ViewChild('DataEditForm') DataEditForm;
  @ViewChild('areYouSure') areYouSure: AreYouSureModal;
  
  public componentName: string;
  public projectId: number;
  public projectData: Array<IDatahost>;
  public neededUpdating: boolean; // if the url isn't formatted, flag so know to PUT it after fixing
  public isEditing: boolean;
  private tempData: IDatahost;
  public errorFlag: boolean;
  public rowBeingEdited: number;
  public nextURL: string;
  public messageToShow: string;
  private deleteID: number;
  public errorMessage: string;
  private dataSubscript;
  private putDHsubscript;
  private messageSubscript;
  private pdataSubscript;
  private nextUrlSubscript;
  private postDHsubscript;
  private deleteDHsubscript;

  constructor(private _projectDetService: ProjectdetailService, private _dialogService: DialogService, private _route: ActivatedRoute, public _router: Router) { 
    this.errorFlag = false; // this keeps the showReqModal() subscription from firing twice and showing 2 modals
  }

  ngOnInit() { 
    this.componentName = "ProjData";
    this.neededUpdating = false; this.rowBeingEdited = -1; //start it off neg  
    this.dataSubscript = this._route.parent.data.subscribe((data: { fullProject: IFullproject }) => {
      this.projectData = data.fullProject.DataHosts;    
      this.projectId = data.fullProject.ProjectId;
      // if any ProjDatum, make sure the url (if one) is formatted properly
      for (var pdu = 0; pdu < this.projectData.length; pdu++) {
          var ind = pdu;
          
          if (this.projectData[ind].portal_url !== undefined && !this.projectData[ind].portal_url.startsWith('http')) {
              //there is a url and it's not formatted
              this.neededUpdating = true;
              this.projectData[ind].portal_url = 'http://' + this.projectData[ind].portal_url;

              this.putDHsubscript = this._projectDetService.putDatahost(this.projectData[ind].data_host_id, this.projectData[ind]).subscribe((r: IDatahost) => {
                r.isEditing = false;
                this.projectData[ind] = r;                        
              });// end put
          } // end if no url
          this.projectData[ind].isEditing = false;
      } // end foreach

      //if they needed updating, update the service
      if (this.neededUpdating) this._projectDetService.setProjectData(this.projectData);

      this.messageSubscript = this.messageSubscript = this._dialogService.MessageToShow.subscribe((m: string) => {
        this.messageToShow = m;
      }); 
    });
    this.pdataSubscript = this._projectDetService.projData().subscribe((d: Array<IDatahost>) => {
      this.projectData = d;
    });
    this.nextUrlSubscript = this._dialogService.nextUrl.subscribe((s:any) => {
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
      this.putDHsubscript = this._projectDetService.putDatahost(d.data_host_id, d).subscribe((r: IDatahost) => {
        //  alert("data host updated");
        r.isEditing = false;
        this.projectData[i] = r;
        this._projectDetService.setProjectData(this.projectData);
        this._projectDetService.setLastEditDate(new Date());
        this.rowBeingEdited = -1;
        this.isEditing = false; // set to true so create new is disabled
        if (this.DataEditForm.form.dirty) this.DataEditForm.reset();
      });
    }
  }
  public deleteDataHost(id: number){
    this._dialogService.setMessage("Are you sure you want to delete this?");
    this.areYouSure.showSureModal(); // listener is AreYouSureDialogResponse()
    this.deleteID = id;
  }

  public ShowRequiredModal(s:any){    
    this._dialogService.setAtLeast1Modal(false); // need to reset it first   
    this._dialogService.setAtLeast1Modal(true);
  }
  // create new data host
  public AddDataHost(d: IDatahost){
    d.project_id = this.projectId;
    this.postDHsubscript = this._projectDetService.postDatahost(d).subscribe(
      res => {
        this._projectDetService.setLastEditDate(new Date());
        console.log("project datahosts updated")
      },
      error => this.errorMessage = error
    );
  }
  // response from dialog (either want to leave here without saving edits or want to delete datahost)
  public AreYouSureDialogResponse(val:boolean){
    //if they clicked Yes
    if (val) {
      //if they are coming form the change tabs are you sure modal
      if (this.messageToShow == "Are you sure you want to change tabs? Any unsaved information will be lost.") {
        this.CancelEditRowClicked(this.rowBeingEdited); // clear out what they've done
        this._router.navigate([this.nextURL]); // go to where they want to go
      }
      else {
        //delete the datahost
        //get the index to be deleted by the id
        let ind: number;
        this.projectData.some((pdh, index, _ary) => {
          if (pdh.data_host_id === this.deleteID) ind = index;
          return pdh.data_host_id === this.deleteID;
        });
        //delete it
        this.deleteDHsubscript = this._projectDetService.deleteDatahost(this.deleteID).subscribe(
          result => {
            this.projectData.splice(ind, 1); //delete from array
            this._projectDetService.setProjectData(this.projectData); // udpdate service
            this._projectDetService.setLastEditDate(new Date());
          },
          error => this.errorMessage = error
        );
      }
    }
  }
  
  ngOnDestroy() {
      // Clean up to avoid memory leak. unsubscribe from all stuff
      this.dataSubscript.unsubscribe();      
      this.messageSubscript.unsubscribe();
      this.pdataSubscript.unsubscribe();
      this.nextUrlSubscript.unsubscribe();

      if (this.putDHsubscript) this.putDHsubscript.unsubscribe();
      if (this.postDHsubscript) this.postDHsubscript.unsubscribe();
      if (this.deleteDHsubscript) this.deleteDHsubscript.unsubscribe();
      this.projectData = undefined;
      this.projectId = undefined;
      if (this.tempData) this.tempData = undefined;
  }

  // did they make a change and not save?
  public canDeactivate(nextUrl): Promise<boolean> | boolean {    
    if (this.DataEditForm.form.dirty) {
      this._dialogService.setMessage("Are you sure you want to change tabs? Any unsaved information will be lost.");
      this.areYouSure.showSureModal();
    } else {
      return true;
    }
  }  
}

