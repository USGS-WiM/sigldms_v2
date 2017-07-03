// ------------------------------------------------------------------------------
// ----- projectcoop.component --------------------------------------------------
// ------------------------------------------------------------------------------

// copyright:   2016 WiM - USGS
//
// authors:  Tonia Roddick USGS Wisconsin Internet Mapping             
//
// purpose: information on this project's cooperators (add, delete)

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { ProjectdetailService } from "app/projectdetail/projectdetail.service";
import { IOrganizationresource } from "app/shared/interfaces/projects/orgresource.interface";
import { ActivatedRoute } from "@angular/router";
import { IFullproject } from "app/shared/interfaces/projects/fullProject.interface";
import { OrganizationModal } from "app/shared/components/organization/organization.modal";
import { LookupsService } from "app/shared/services/lookups.service";
import { IDivision } from "app/shared/interfaces/lookups/division.interface";
import { ISection } from "app/shared/interfaces/lookups/section.interface";
import { IOrganization } from "app/shared/interfaces/lookups/organization.interface";
import { DialogService } from "app/shared/services/dialog.service";
import { AreYouSureModal } from "app/shared/components/areYouSure.modal";


@Component({
	templateUrl: 'projectcoop.component.html'
})
export class ProjectcooperatorComponent implements OnInit {
	@ViewChild('orgModal') organizationModal: OrganizationModal;	
	@ViewChild('areYouSure') areYouSure: AreYouSureModal;
	public errorMessage: string;
	public projectId: number;
	public newOrgForm: FormGroup; //myform
	public newOrg: IOrganizationresource;
	public projectCoops: Array<IOrganizationresource>;	
	private dataSubscript;
	private divisionList: Array<IDivision>;
	public orgDivList: Array<IDivision>; //updates when org is selected
	private sectionList: Array<ISection>;
	public divSecList: Array<ISection>; // updates when div is selected
	private orgList: Array<IOrganization>;	
	public orgTip: any;
	public deleteID: number; //hold on to the one they want to delete
	public messageToShow: string;

	constructor(private _projDetService: ProjectdetailService, private _lookupService: LookupsService, 
				private _route: ActivatedRoute, private _fb: FormBuilder, private _dialogService: DialogService) {
		this.newOrgForm = _fb.group({
			OrganizationName:  new FormControl(null),
			DivisionName:  new FormControl(null),
			SectionName:  new FormControl(null)
		});
   }

	ngOnInit() {
		//this.newOrg = { OrganizationName: ""};
		this.orgDivList = []; this.divSecList = [];
		this.newOrg = {org_id: -1, div_id: -1, sec_id: -1};
		this.orgTip = {
			orgName: "After selecting your Organization (and Division/Office and Section, if applicable) in the drop-down menu, click the “Add Organization” button to save. Repeat if multiple organizations apply."
		}
		// get the fullProject from route
		this.dataSubscript = this._route.parent.data.subscribe((data: { fullProject: IFullproject }) => {
			this.projectId = data.fullProject.ProjectId;
			this.projectCoops = data.fullProject.Organizations;			
		});
		this._projDetService.projOrganizations.subscribe((po: Array<IOrganizationresource>) => {
			this.projectCoops = po;
		})
		// when org changes, update division
		this.newOrgForm.controls['OrganizationName'].valueChanges.subscribe((selectedOption) => {			
			this.orgDivList = this.divisionList.filter(d=> {return d.org_id == selectedOption;});
			if (selectedOption == "") this.newOrg.org_id = -1;
			else this.newOrg.org_id = selectedOption;		
		});
		// when div changes, update section
		this.newOrgForm.controls['DivisionName'].valueChanges.subscribe((selectedOption) => {
			this.divSecList = this.sectionList.filter(s=> {return s.div_id == selectedOption;});
			if (selectedOption == "") this.newOrg.div_id = -1;
			else this.newOrg.div_id = selectedOption;
		});		
		// when div changes, update section
		this.newOrgForm.controls['SectionName'].valueChanges.subscribe((selectedOption) => {			
			if (selectedOption == "") this.newOrg.sec_id = -1;
			else this.newOrg.sec_id = selectedOption;
		});
		
		// subscribed to get org list
		this._lookupService.Orgs.subscribe((o: Array<IOrganization>) => {
			this.orgList = o;
		});
		// subscribed to get division list
		this._lookupService.Divisions.subscribe((d: Array<IDivision>) => {
			this.divisionList = d;
		});
		// subscribed to get section list
		this._lookupService.Sections.subscribe((s: Array<ISection>) => {
			this.sectionList = s;
		});
		this._dialogService.MessageToShow.subscribe((m: string) => {
			this.messageToShow = m;
		});
	}

	public showOrgModal() {
		this.organizationModal.showOrgModal();
	}
	// modal was closed, e contains: [this.orgDrop, this.divDrop, this.secDrop, this.chosenOrg, this.chosenDiv, this.chosenSec]?
	public newValuesFromOrgModal(e){
		// update services which will update main arrays via subscribe above
		this._lookupService.setOrganizations(e[0]);
		this._lookupService.setDivisions(e[1]);
		this._lookupService.setSections(e[2]);
		// update selected values (triggers ValueChange above to update respective drops)
		this.newOrgForm.controls['OrganizationName'].setValue(e[3]);
		this.newOrgForm.controls['DivisionName'].setValue(e[4]);
		this.newOrgForm.controls['SectionName'].setValue(e[5]);
	}
	//org has been chosen/created, now add it to the project
	public addOrgToProj(){
		// first see if it's already a part of this project
		let alreadyApart = this.projectCoops.filter(po => po.org_id == this.newOrgForm.controls['OrganizationName'].value && 
								po.div_id == this.newOrgForm.controls['DivisionName'].value && po.sec_id == this.newOrgForm.controls['SectionName'].value);
		if (alreadyApart.length > 0){
			//already in there
			alert("this Organization is already a part of this project");
		} else {
			// add it
			let orgId = this.newOrgForm.controls['OrganizationName'].value;
			let divId = this.newOrgForm.controls['DivisionName'].value < 1 ? 0 : this.newOrgForm.controls['DivisionName'].value;
			let secId = this.newOrgForm.controls['SectionName'].value < 1 ? 0 : this.newOrgForm.controls['SectionName'].value;
			this._projDetService.postProjOrganizationRes(this.projectId, orgId, divId, secId).subscribe(
				res => {
					this._projDetService.setLastEditDate(new Date());
					console.log("project organization added");
					//clear the form
					this.newOrgForm.controls['OrganizationName'].setValue(null);
					this.newOrgForm.controls['DivisionName'].setValue(null);
					this.newOrgForm.controls['SectionName'].setValue(null);
				},
				error => this.errorMessage = error
			);		

		}
	}

	public deleteOrgFromProject(orgSysId: number){
		this._dialogService.setMessage("Are you sure you want to delete this?");
		this.areYouSure.showSureModal(); // listener is AreYouSureDialogResponse()
		this.deleteID = orgSysId;
	}
	// response from dialog (either want to leave here without saving edits or want to delete datahost)
	public AreYouSureDialogResponse(val: boolean) {
		//if they clicked Yes
		if (val) {
			//if they are coming form the change tabs are you sure modal
			if (this.messageToShow == "Are you sure you want to change tabs? Any unsaved information will be lost.") {
			//	this.CancelEditRowClicked(this.rowBeingEdited); // clear out what they've done
			//	this._router.navigate([this.nextURL]); // go to where they want to go
			}
			else {
				//delete the datahost
				//get the index to be deleted by the id
				let ind: number;
				this.projectCoops.some((pc, index, _ary) => {
					if (pc.organization_system_id === this.deleteID) ind = index;
					return pc.organization_system_id === this.deleteID;
				});
				//delete it
				this._projDetService.deleteProjOrganizationRes(this.projectId, this.deleteID).subscribe(
					result => {
						this.projectCoops.splice(ind, 1); //delete from array
						this._projDetService.setProjectOrganizations(this.projectCoops); // udpdate service
						this._projDetService.setLastEditDate(new Date());
					},
					error => this.errorMessage = error
				);
			}
		}
	}

	ngOnDestroy() {
		// Clean up to avoid memory leak. unsubscribe from all stuff
		
	}
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
