// ------------------------------------------------------------------------------
// ----- projectcontact.component -----------------------------------------------
// ------------------------------------------------------------------------------

// copyright:   2016 WiM - USGS
// authors:  Tonia Roddick USGS Wisconsin Internet Mapping
// purpose: information on this project's contacts (add, edit, delete)

import { Component, OnInit, ViewChild } from '@angular/core';
import { IContactresource } from "app/shared/interfaces/projects/contactresource.interface";
import { ProjectdetailService } from "app/projectdetail/projectdetail.service";
import { IFullproject } from "app/shared/interfaces/projects/fullProject.interface";
import { ActivatedRoute } from "@angular/router";
import { OrganizationModal } from "app/shared/components/organization/organization.modal";
import { AreYouSureModal } from "app/shared/components/areYouSure.modal";
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { IDivision } from "app/shared/interfaces/lookups/division.interface";
import { ISection } from "app/shared/interfaces/lookups/section.interface";
import { IOrganization, IOrganizationsystem } from "app/shared/interfaces/lookups/organization.interface";
import { LookupsService } from "app/shared/services/lookups.service";
import { DialogService } from "app/shared/services/dialog.service";
import { IOrganizationresource } from "app/shared/interfaces/projects/orgresource.interface";

@Component({
	templateUrl: 'projectcontact.component.html',
	styleUrls: ['./projectcontact.component.css'],
})

export class ProjectcontactComponent {//} implements OnInit {
	@ViewChild('orgModal') organizationModal: OrganizationModal;
	@ViewChild('areYouSure') areYouSure: AreYouSureModal;
	@ViewChild('ContactEditForm') ContactEditForm;
	public errorMessage: string;
	public projectId: number;
	public newContact: IContactresource;
	public projectContacts: Array<IContactresource>;
	private dataSubscript;
	private divisionList: Array<IDivision>;
	public orgDivList: Array<IDivision>; //updates when org is selected
	private sectionList: Array<ISection>;
	public divSecList: Array<ISection>; // updates when div is selected
	private orgList: Array<IOrganization>;
	public contactTip: any;
	public deleteID: number; //hold on to the one they want to delete
	public messageToShow: string;
	public neededUpdating: boolean;
	public rowBeingEdited: number;
	public tempData: IContactresource;
	public isEditing: boolean;
	public newOrg: IOrganizationresource;
	public newContactForm: FormGroup; //create contact

	constructor(private _projDetService: ProjectdetailService, private _route: ActivatedRoute, private _lookupService: LookupsService, 
				private _dialogService: DialogService, private _fb: FormBuilder) { 
		this.newContactForm = _fb.group({
			OrganizationName:  new FormControl(null),
			DivisionName:  new FormControl(null),
			SectionName:  new FormControl(null)
		});
	}

	ngOnInit() {
		this.newOrg = {org_id: -1, div_id: -1, sec_id: -1};
		this.neededUpdating = false; this.rowBeingEdited = -1; //start it off neg  
		this.dataSubscript = this._route.parent.data.subscribe((data: { fullProject: IFullproject }) => {
			this.projectContacts = data.fullProject.Contacts;			
			this.projectId = data.fullProject.ProjectId;
			this.projectContacts.forEach((pc: IContactresource) => {
				if (pc.phone && !pc.phone.startsWith('(')) {
					//there is a phone and it's not formatted
					this.neededUpdating = true;
					let re = /[()\\s-]+/gi; 
					let pcPh =  pc.phone.replace(re, "");
					
					if (pcPh.length == 10)					
					pc.phone = "(" + pcPh.substring(0, 3) + ") " + pcPh.substring(3, 6) + "-" + pcPh.substring(6);
				
					if (pcPh.length > 10)
						pc.phone = "(" + pcPh.substring(0, 3) + ") " + pcPh.substring(3, 6) + "-" + pcPh.substring(6, 10) + " x" + pcPh.substring(10);

					this._projDetService.putContact(pc.contact_id, pc).subscribe((c: IContactresource) => {
						pc.isEditing = false;
						pc = c;
					});// end put
				} // end if no url
				pc.isEditing = false;
			});

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
		this.contactTip = {
			contactName: "Enter the contact's first and last name.",
			email: "Enter the contact's email address.",
			phone: "Enter the contact's phone number. To add an extension, immediately following the phone number type 'x' and then the extension number."
		}
	}

	// want to edit
	public EditRowClicked(i: number) {
		this.rowBeingEdited = i;
		this.tempData = Object.assign({}, this.projectContacts[i]); // make a copy in case they cancel
		this.projectContacts[i].isEditing = true;
		this.isEditing = true; // set to true so create new is disabled
		this.newOrg = { org_id: this.projectContacts[i].org_id, div_id: this.projectContacts[i].div_id, sec_id: this.projectContacts[i].sec_id };
	}

	// nevermind editing
	public CancelEditRowClicked(i: number) {
		this.projectContacts[i] = Object.assign({}, this.tempData);
		this.projectContacts[i].isEditing = false;
		this.rowBeingEdited = -1;
		this.isEditing = false; // set to true so create new is disabled
		this.newOrg = undefined;
		if (this.ContactEditForm.form.dirty) this.ContactEditForm.reset();
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
		this.projectContacts[this.rowBeingEdited].org_id = e[3];
		this.projectContacts[this.rowBeingEdited].ContactOrgName = e[0].filter(org => org.organization_id == e[3])[0].organization_name;
		this.projectContacts[this.rowBeingEdited].div_id = e[4];
		this.projectContacts[this.rowBeingEdited].ContactDivName = e[4] > 0 ? e[1].filter(div => div.division_id == e[4])[0].division_name : "";
		this.projectContacts[this.rowBeingEdited].sec_id = e[5];
		this.projectContacts[this.rowBeingEdited].ContactSecName = e[5] > 0 ? e[2].filter(sec => sec.section_id == e[5])[0].section_name : "";
		this.newOrg = { org_id: e[3], div_id: e[4], sec_id: e[5] };
	}

	public saveContact(aContact: IContactresource, index: number) {
		// post the org_system in case they changed it
		let newOrgSys = {org_id: this.newOrg.org_id, div_id: this.newOrg.div_id, sec_id: this.newOrg.sec_id };
		this._projDetService.postOrganizationSystem(newOrgSys).subscribe((os: IOrganizationsystem) => {
			aContact.organization_system_id = os.organization_system_id;
			// now update contact (format the contact entity)
			
		})
		let what = aContact;
	}
	ngOnDestroy() {
		// Clean up to avoid memory leak. unsubscribe from all stuff
		this.dataSubscript.unsubscribe()

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
