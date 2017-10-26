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
import { AreYouSureModal } from "app/shared/components/areYouSure.modal";
import { Toast } from 'angular2-toaster';

@Component({
	templateUrl: "projectpub.component.html"//,
	// styleUrls: ['./projectpub.component.css'], 
})
export class ProjectpublicationComponent implements OnInit {
	@ViewChild('PubEditForm') PubEditForm;
	@ViewChild('areYouSure') areYouSure: AreYouSureModal;

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

	private dataSubscript;
	private putSubscript;
	private messageSubscript;
	private pubSubscript;
	private urlSubscript;
	private postSubscript;
	private deleteSubscript;

	constructor(private _projDetService: ProjectdetailService, private _dialogService: DialogService, private _route: ActivatedRoute, public _router: Router) {
		this.errorFlag = false; // this keeps the showReqModal() subscription from firing twice and showing 2 modals
	}

	ngOnInit() {
		this.componentName = "ProjData";
		this.neededUpdating = false; this.rowBeingEdited = -1; //start it off neg  
		this.dataSubscript = this._route.parent.data.subscribe((data: { fullProject: IFullproject }) => {
			this.projectPubs = data.fullProject.Publications;
			this.projectId = data.fullProject.ProjectId;
			this.projectPubs.forEach((pp: IPublication) => {
				if (pp.url !== undefined && !pp.url.startsWith('http')) {
					//there is a url and it's not formatted
					this.neededUpdating = true;
					pp.url = 'http://' + pp.url;

					this.putSubscript = this._projDetService.putPublication(pp.publication_id, pp).subscribe((p: IPublication) => {
						p.isEditing = false;
						pp = p;
					});// end put
				} // end if no url
				pp.isEditing = false;
			});

			//if they needed updating, update the service
			if (this.neededUpdating) 
				this._projDetService.setProjectPublications(this.projectPubs);
			
		});
		this.messageSubscript = this._dialogService.MessageToShow.subscribe((m: string) => {
			this.messageToShow = m;
		});
		this.pubSubscript = this._projDetService.projPublications().subscribe((p: Array<IPublication>) => {
			this.projectPubs = p;
		});
		this.urlSubscript = this._dialogService.nextUrl.subscribe((s: any) => {
			this.nextURL = s;
		});
	} // end ngOnInit()

	// want to edit
	public EditRowClicked(i: number) {
		this.rowBeingEdited = i;
		this.tempPub = Object.assign({}, this.projectPubs[i]); // make a copy in case they cancel
		this.projectPubs[i].isEditing = true;
		this.isEditing = true; // set to true so create new is disabled
	}

	// nevermind editing
	public CancelEditRowClicked(i: number) {
		this.projectPubs[i] = Object.assign({}, this.tempPub);
		this.projectPubs[i].isEditing = false;
		this.rowBeingEdited = -1;
		this.isEditing = false; // set to true so create new is disabled
		if (this.PubEditForm.form.dirty) this.PubEditForm.reset();
	}

	// edits made, save clicked
	public savePublication(p: IPublication, i: number) {
		if ((p.description == undefined || p.description == "") &&
			(p.url == "" || p.url == "http://" || p.url == undefined) &&
			(p.title == undefined || p.title == "")) {
			this.ShowRequiredModal(true);
		} else {
			delete p.isEditing;
			this.putSubscript = this._projDetService.putPublication(p.publication_id, p).subscribe((p: IPublication) => {
				p.isEditing = false;
				this.projectPubs[i] = p;
				this._projDetService.setProjectPublications(this.projectPubs);
				//update project's last_edit_date
				this._projDetService.setLastEditDate(new Date());
				this.rowBeingEdited = -1;
				this.isEditing = false; // set to true so create new is disabled
				if (this.PubEditForm.form.dirty) this.PubEditForm.reset();
				let toast: Toast = {
					type: 'success',
					title: 'Success',
					body: 'Publication updated'
				};
				this._dialogService.showToast(toast); 
			}, error => {
				let toast: Toast = {
					type: 'error',
					title: 'Error',
					body: 'Error updating publication: ' + error
				};
				this._dialogService.showToast(toast); 
			});
		}
	}
	public deletePublication(id: number) {
		this._dialogService.setMessage("Are you sure you want to delete this?");
		this.areYouSure.showSureModal(); // listener is AreYouSureDialogResponse()
		this.deleteID = id;
	}

	public ShowRequiredModal(s: any) {
		this._dialogService.setAtLeast1Modal(false); // need to reset it first
		//  this.errorFlag = true;    
		this._dialogService.setAtLeast1Modal(true);
	}
	// create new data host
	public AddPublication(p: IPublication) {
		// p.project_id = this.projectId;
		this.postSubscript = this._projDetService.postPublication(this.projectId, p).subscribe(
			res => {
				this._projDetService.setLastEditDate(new Date());
				let toast: Toast = {
					type: 'success',
					title: 'Success',
					body: 'Publication added'
				};
				this._dialogService.showToast(toast); 
			},
			error => {
				let toast: Toast = {
					type: 'error',
					title: 'Error',
					body: 'Error adding publication: ' + error
				};
				this._dialogService.showToast(toast); 
			}
		);
	}
	// response from dialog (either want to leave here without saving edits or want to delete datahost)
	public AreYouSureDialogResponse(val: boolean) {
		//if they clicked Yes
		if (val) {
			//if they are coming form the change tabs are you sure modal
			if (this.messageToShow == "Are you sure you want to change tabs? Any unsaved information will be lost.") {
				this.CancelEditRowClicked(this.rowBeingEdited); // clear out what they've done
				this._router.navigate([this.nextURL]); // go to where they want to go
			}
			else {
				//delete the publication
				//get the index to be deleted by the id
				let ind: number;
				this.projectPubs.some((pp, index, _ary) => {
					if (pp.publication_id === this.deleteID) ind = index;
					return pp.publication_id === this.deleteID;
				});
				//delete it
				this.deleteSubscript = this._projDetService.deletePublication(this.projectId, this.deleteID).subscribe(
					result => {
						this.projectPubs.splice(ind, 1); //delete from array
						this._projDetService.setProjectPublications(this.projectPubs); // udpdate service
						this._projDetService.setLastEditDate(new Date());
						let toast: Toast = {
							type: 'success',
							title: 'Success',
							body: 'Publication deleted'
						};
						this._dialogService.showToast(toast); 
					},
					error => {
						let toast: Toast = {
							type: 'error',
							title: 'Error',
							body: 'Error deleting publication: ' + error
						};
						this._dialogService.showToast(toast); 
					}
				);
			}
		}
	}

	// did they make a change and not save?
	public canDeactivate(nextUrl): Promise<boolean> | boolean {
		if (this.PubEditForm.form.dirty) {
			this._dialogService.setMessage("Are you sure you want to change tabs? Any unsaved information will be lost.");
			this.areYouSure.showSureModal();
		} else {
			return true;
		}
	}
	ngOnDestroy() {
		this.dataSubscript.unsubscribe();
		this.messageSubscript.unsubscribe();
		this.pubSubscript.unsubscribe();
		this.urlSubscript.unsubscribe();
		this.projectId = undefined;
		this.projectPubs = undefined;

		if (this.putSubscript) this.putSubscript.unsubscribe();
		if (this.postSubscript) this.postSubscript.unsubscribe();
		if (this.deleteSubscript) this.deleteSubscript.unsubscribe();
	}
}
/*HOW TO PROPERLY UNSUBSCRIBE
import { Component, OnDestroy, OnInit } from '@angular/core';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';
import { MyThingService } from '../my-thing.service';

@Component({
    selector: 'my-thing',
    templateUrl: './my-thing.component.html'
})
export class MyThingComponent implements OnDestroy, OnInit {
    private ngUnsubscribe: Subject<void> = new Subject<void>();
    constructor(private myThingService: MyThingService) { }

    ngOnInit() {
        this.myThingService.getThings()
            .takeUntil(this.ngUnsubscribe)
            .subscribe(things => console.log(things));

        this.myThingService.getOtherThings()
            .takeUntil(this.ngUnsubscribe)
            .subscribe(things => console.log(things));
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}*/

