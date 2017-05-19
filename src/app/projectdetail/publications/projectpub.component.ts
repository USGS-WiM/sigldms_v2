// ------------------------------------------------------------------------------
// ----- projectpub.component -----------------------------------------------
// ------------------------------------------------------------------------------

// copyright:   2016 WiM - USGS
//
// authors:  Tonia Roddick USGS Wisconsin Internet Mapping             
//
// purpose: information on this project's publications (add, edit, delete)

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ProjectdetailService } from "app/projectdetail/projectdetail.service";
import { IPublication } from "app/shared/interfaces/projects/publication.interface";
import { ActivatedRoute, Router } from "@angular/router";
import { IFullproject } from "app/shared/interfaces/projects/fullProject.interface";
import { DialogService } from "app/shared/services/dialog.service";

@Component({
  templateUrl: "projectpub.component.html"//,
  // styleUrls: ['./projectpub.component.css'], 
})
export class ProjectpublicationComponent implements OnInit {
  @ViewChild('PubEditForm') PubEditForm;

  public componentName: string;
  public projectId: number;
  public projectPubs: Array<IPublication>;
  public neededUpdating: boolean; // if the url isn't formatted, flag so know to PUT it after fixing
  public isEditing: boolean;
  private tempPub: IPublication;
  public errorFlag: boolean;
  public rowBeingEdited: number;
  public nextURL: string;
  public messageToShow: string;
  private deleteID: number;
  public errorMessage: string;

  constructor(private _projectDetService: ProjectdetailService, private _dialogService: DialogService, private _route: ActivatedRoute, public _router: Router) { 
    this.errorFlag = false; // this keeps the showReqModal() subscription from firing twice and showing 2 modals
  }

  ngOnInit() { 
    this.componentName = "ProjData";
    this.neededUpdating = false; this.rowBeingEdited = -1; //start it off neg  
    this._route.parent.data.subscribe((data: { fullProject: IFullproject }) => {
      this.projectPubs = data.fullProject.Publications;    
      this.projectId = data.fullProject.ProjectId;
      for (var pdu = 0; pdu < this.projectPubs.length; pdu++) {
          var ind = pdu;
          
          if (this.projectPubs[ind].url !== undefined && !this.projectPubs[ind].url.startsWith('http')) {
              //there is a url and it's not formatted
              this.neededUpdating = true;
              this.projectPubs[ind].url = 'http://' + this.projectPubs[ind].url;

              this._projectDetService.putPublication(this.projectPubs[ind].publication_id, this.projectPubs[ind]).subscribe((p: IPublication) => {
                p.isEditing = false;
                this.projectPubs[ind] = p;                        
              });// end put
          } // end if no url
          this.projectPubs[ind].isEditing = false;
      } // end foreach

      //if they needed updating, update the service
      if (this.neededUpdating) this._projectDetService.setProjectPublications(this.projectPubs);

      this._dialogService.MessageToShow.subscribe((m: string) => {
        this.messageToShow = m;
      }); 
    });
    this._projectDetService.projPublications().subscribe((p: Array<IPublication>) => {
      this.projectPubs = p;
    });
    this._dialogService.nextUrl.subscribe((s:any) => {
      this.nextURL = s;
    });
  } // end ngOnInit()

  // want to edit
  public EditRowClicked(i:number) {
    this.rowBeingEdited = i;
    this.tempPub = Object.assign({}, this.projectPubs[i]); // make a copy in case they cancel
    this.projectPubs[i].isEditing = true;    
    this.isEditing = true; // set to true so create new is disabled
  }

  // nevermind editing
  public CancelEditRowClicked(i:number) {
    this.projectPubs[i] = Object.assign({}, this.tempPub);
    this.projectPubs[i].isEditing = false;
    this.rowBeingEdited = -1;
    this.isEditing = false; // set to true so create new is disabled
    if (this.PubEditForm.form.dirty) this.PubEditForm.reset();
  }

  // edits made, save clicked
  public savePublication(p: IPublication, i:number) {
    if ((p.description == undefined || p.description == "") && 
        (p.url == "" || p.url == "http://" || p.url == undefined) &&
        (p.title == undefined || p.title == "")) {
      this.ShowRequiredModal(true);
    } else {      
      delete p.isEditing;
      this._projectDetService.putPublication(p.publication_id, p).subscribe((p: IPublication) => {
        p.isEditing = false;
        this.projectPubs[i] = p;
        this._projectDetService.setProjectPublications(this.projectPubs);
        //update project's last_edit_date
        this._projectDetService.setLastEditDate(new Date());
        this.rowBeingEdited = -1;
        this.isEditing = false; // set to true so create new is disabled
        if (this.PubEditForm.form.dirty) this.PubEditForm.reset();
      });
    }
  }
  public deletePublication(id: number){
    this._dialogService.setMessage("Are you sure you want to delete this?");
    this._dialogService.setAreYouSureModal(true); //shows the modal. listener is AreYouSureDialogResponse()
    this.deleteID = id;
  }

  public ShowRequiredModal(s:any){    
    this._dialogService.setAtLeast1Modal(false); // need to reset it first
  //  this.errorFlag = true;    
    this._dialogService.setAtLeast1Modal(true);
  }
  // create new data host
  public AddPublication(p: IPublication){
    // p.project_id = this.projectId;
    this._projectDetService.postPublication(this.projectId, p).subscribe(
      res => {
        this._projectDetService.setLastEditDate(new Date());
        console.log("project Publication updated")
      },
      error => this.errorMessage = error
    );
  }
  // response from dialog (either want to leave here without saving edits or want to delete datahost)
  public AreYouSureDialogResponse(val:boolean){
    this._dialogService.setAreYouSureModal(false);   
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
        this.projectPubs.some((pp, index, _ary) => {
          if (pp.publication_id === this.deleteID) ind = index;
          return pp.publication_id === this.deleteID;
        });
        //delete it
        this._projectDetService.deletePublication(this.projectId, this.deleteID).subscribe(
          result => {
            this.projectPubs.splice(ind, 1); //delete from array
            this._projectDetService.setProjectPublications(this.projectPubs); // udpdate service
            this._projectDetService.setLastEditDate(new Date());
          },
          error => this.errorMessage = error
        );
      }
    }
  }
  
  // did they make a change and not save?
  public canDeactivate(nextUrl): Promise<boolean> | boolean {    
    this._dialogService.setAreYouSureModal(false); // make sure this is false first so it fires
    
    if (this.PubEditForm.form.dirty) {
      this._dialogService.setMessage("Are you sure you want to change tabs? Any unsaved information will be lost.");
      this._dialogService.setAreYouSureModal(true);
    } else {
      return true;
    }
  }  
}

