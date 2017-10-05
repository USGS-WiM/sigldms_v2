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
import { FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";
import { IDivision } from "app/shared/interfaces/lookups/division.interface";
import { ISection } from "app/shared/interfaces/lookups/section.interface";
import { IOrganization, IOrganizationsystem } from "app/shared/interfaces/lookups/organization.interface";
import { LookupsService } from "app/shared/services/lookups.service";
import { DialogService } from "app/shared/services/dialog.service";
import { IOrganizationresource } from "app/shared/interfaces/projects/orgresource.interface";
import { IContact } from "app/shared/interfaces/projects/contact.interface";
import { Toast } from 'angular2-toaster';

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
			name: new FormControl(null, Validators.required),
			email: new FormControl(null, [Validators.required, Validators.pattern('[^ @]*@[^ @]*')]),
			phone: new FormControl(null, Validators.required),
			ContactOrgName:  new FormControl(null, Validators.required),
			ContactDivName:  new FormControl(null),
			ContactSecName:  new FormControl(null)
		});
	}

	ngOnInit() {
		this.orgDivList = []; this.divSecList = [];
		this.newContact = { name: '', email: '', phone: '', organization_system_id: 0 };
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
		this._projDetService.projContacts().subscribe((c: Array<IContactresource>) => {
			this.projectContacts = c;
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
		// when org changes, update division
		this.newContactForm.controls['ContactOrgName'].valueChanges.subscribe((selectedOption) => {			
			this.orgDivList = this.divisionList.filter(d=> {return d.org_id == selectedOption;});
			if (selectedOption == "" || selectedOption == null) {
				this.newOrg.org_id = -1; this.newOrg.OrganizationName = "";
			} else {
				this.newOrg.org_id = selectedOption;		
				this.newOrg.OrganizationName = this.orgList.filter(o => {return o.organization_id == selectedOption; })[0].organization_name;
			}
		});
		// when div changes, update section
		this.newContactForm.controls['ContactDivName'].valueChanges.subscribe((selectedOption) => {
			this.divSecList = this.sectionList.filter(s=> {return s.div_id == selectedOption;});
			if (selectedOption == "" || selectedOption == null) {
				this.newOrg.div_id = -1; this.newOrg.DivisionName = "";
			} else {
				this.newOrg.div_id = selectedOption;
				this.newOrg.DivisionName = this.divisionList.filter(d => {return d.division_id == selectedOption; })[0].division_name;
			}
		});		
		// when div changes, update section
		this.newContactForm.controls['ContactSecName'].valueChanges.subscribe((selectedOption) => {			
			if (selectedOption == "" || selectedOption == null) {
				this.newOrg.sec_id = -1; this.newOrg.SectionName = "";
			} else {
				this.newOrg.sec_id = selectedOption;
				this.newOrg.SectionName = this.sectionList.filter(s => {return s.section_id == selectedOption;})[0].section_name;
			}
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
		this.newOrg = {org_id: -1, div_id: -1, sec_id: -1};
		if (this.ContactEditForm.form.dirty) this.ContactEditForm.reset();
	}

	public showOrgModal() {
		this.organizationModal.showOrgModal();
	}

	// modal was closed, e contains: [this.orgDrop, this.divDrop, this.secDrop, this.chosenOrg, this.chosenDiv, this.chosenSec]?
	public newValuesFromOrgModal(e){
		if (this.isEditing){
			// update selected values (triggers ValueChange above to update respective drops)
			this.projectContacts[this.rowBeingEdited].org_id = e[3];
			this.projectContacts[this.rowBeingEdited].ContactOrgName = e[0].filter(org => org.organization_id == e[3])[0].organization_name;
			this.projectContacts[this.rowBeingEdited].div_id = e[4];
			this.projectContacts[this.rowBeingEdited].ContactDivName = e[4] > 0 ? e[1].filter(div => div.division_id == e[4])[0].division_name : "";
			this.projectContacts[this.rowBeingEdited].sec_id = e[5];
			this.projectContacts[this.rowBeingEdited].ContactSecName = e[5] > 0 ? e[2].filter(sec => sec.section_id == e[5])[0].section_name : "";
			this.newOrg = { org_id: e[3], div_id: e[4], sec_id: e[5] };
		} else {
			this.newContact.ContactOrgName = e[0].filter(org => org.organization_id == e[3])[0].organization_name;
			this.newContact.ContactDivName =  e[4] > 0 ? e[1].filter(div => div.division_id == e[4])[0].division_name : "";
			this.newContact.ContactSecName = e[5] > 0 ? e[2].filter(sec => sec.section_id == e[5])[0].section_name : "";
			this.newContact.org_id = e[3]; this.newContact.div_id = e[4]; this.newContact.sec_id = e[5];
			this.newContactForm.controls['ContactOrgName'].setValue(e[3]);
			this.newContactForm.controls['ContactDivName'].setValue(e[4]);
			this.newContactForm.controls['ContactSecName'].setValue(e[5])
		}
		// update services which will update main arrays via subscribe above
		this._lookupService.setOrganizations(e[0]);
		this._lookupService.setDivisions(e[1]);
		this._lookupService.setSections(e[2]);
		
	}
	
	public saveContact(aContact: IContactresource, index: number) {
		if (this.ContactEditForm.valid) {		
			const { ContactEditForm: { value: formValueSnap } } = this; // const formValueSnap = this.myForm.value;
    		
			// post the org_system in case they changed it
			let newOrgSys = {org_id: this.newOrg.org_id, div_id: this.newOrg.div_id, sec_id: this.newOrg.sec_id };
			this._projDetService.postOrganizationSystem(newOrgSys).subscribe((os: IOrganizationsystem) => {
				this.newOrg = { org_id: -1, div_id: -1, sec_id: -1 };
				aContact.organization_system_id = os.organization_system_id;
				// now update contact (format the contact entity)
				let updateContact: IContact = {
					contact_id: aContact.contact_id,
					name: aContact.name,
					email: aContact.email,
					phone: aContact.phone,
					organization_system_id: aContact.organization_system_id,
					science_base_id: aContact.science_base_id
				};
				this._projDetService.putContact(updateContact.contact_id, updateContact).subscribe((r: IContactresource) => {
					//  alert("contact updated");
					aContact.isEditing = false;
					
					this.projectContacts[index] = aContact;
					this._projDetService.setProjectContacts(this.projectContacts);
					this._projDetService.setLastEditDate(new Date());
					this.rowBeingEdited = -1;
					this.isEditing = false; // set to true so create new is disabled
					this.ContactEditForm.reset(formValueSnap, true);
					let toast: Toast = {
						type: 'success',
						title: 'Success',
						body: 'Contact updated'
					};
					this._dialogService.showToast(toast); 
				}, (err) => {
					let toast: Toast = {
						type: 'error',
						title: 'Error',
						body: 'Error updating contact: ' + err
					};
					this._dialogService.showToast(toast); 
				}); //end putContact
			}, (err) => {
				let toast: Toast = {
					type: 'error',
					title: 'Error',
					body: 'Error updating contact organization: ' + err
				};
				this._dialogService.showToast(toast); 
			}); //end postOrganizationSystem			
		}		
	}

	public AddContact() {
		this.newContact.name = this.newContactForm.controls['name'].value;
		this.newContact.email = this.newContactForm.controls['email'].value;
		this.newContact.phone = this.newContactForm.controls['phone'].value;
		
		let newOrgSys = { org_id: this.newContactForm.controls['ContactOrgName'].value,
						  div_id: this.newContactForm.controls['ContactDivName'].value, 
						  sec_id: this.newContactForm.controls['ContactSecName'].value };
		this._projDetService.postOrganizationSystem(newOrgSys).subscribe((os: IOrganizationsystem) => {
			this.newContact.organization_system_id = os.organization_system_id;
			// post new contact
			this._projDetService.postProjContact(this.projectId, this.newContact).subscribe((resp: Array<IContact>) => {
				this.newContact.contact_id = resp.filter(c=> { 
					return c.email == this.newContact.email && c.name == this.newContact.name && c.phone == this.newContact.phone;
				})[0].contact_id;
				this.newContact.isEditing = false;
				this.newContact.ContactOrgName = this.newOrg.OrganizationName;
				this.newContact.org_id = this.newOrg.org_id;
				this.newContact.ContactDivName = this.newOrg.DivisionName;
				this.newContact.div_id = this.newOrg.div_id;
				this.newContact.ContactSecName = this.newOrg.SectionName;
				this.newContact.sec_id = this.newOrg.sec_id;
								
				//returns array of contacts.. need to be array<IContactresource
				this.projectContacts.push(this.newContact);
				this._projDetService.setProjectContacts(this.projectContacts);
				this._projDetService.setLastEditDate(new Date());
				this.newContactForm.reset();
				let toast: Toast = {
					type: 'success',
					title: 'Success',
					body: 'Contact added'
				};
				this._dialogService.showToast(toast); 
			}, error => {
				let toast: Toast = {
					type: 'error',
					title: 'Error',
					body: 'Error adding contact: ' + error
				};
				this._dialogService.showToast(toast); 
			});
		}, error => {
			let toast: Toast = {
				type: 'error',
				title: 'Error',
				body: 'Error adding contact organization: ' + error
			};
			this._dialogService.showToast(toast); 
		}); 
	}
	public DeleteContact(id: number){
		this._dialogService.setMessage("Are you sure you want to delete this?");
		this.areYouSure.showSureModal(); // listener is AreYouSureDialogResponse()
		this.deleteID = id;
	}

	// response from dialog (either want to leave here without saving edits or want to delete datahost)
	public AreYouSureDialogResponse(val: boolean) {
		//if they clicked Yes
		if (val) {
			//if they are coming form the change tabs are you sure modal
			if (this.messageToShow == "Are you sure you want to change tabs? Any unsaved information will be lost.") {
				this.CancelEditRowClicked(this.rowBeingEdited); // clear out what they've done
			//	this._router.navigate([this.nextURL]); // go to where they want to go
			}
			else {
				//delete the publication
				//get the index to be deleted by the id
				let ind: number;
				this.projectContacts.some((pc, index, _ary) => {
					if (pc.contact_id === this.deleteID) ind = index;
					return pc.contact_id === this.deleteID;
				});
				//delete it
				this._projDetService.deleteProjContact(this.projectId, this.deleteID).subscribe(
					result => {
						this.projectContacts.splice(ind, 1); //delete from array
						this._projDetService.setProjectContacts(this.projectContacts); // udpdate service
						this._projDetService.setLastEditDate(new Date());
						let toast: Toast = {
							type: 'success',
							title: 'Success',
							body: 'Contact deleted'
						};
						this._dialogService.showToast(toast); 
					},
					error => {
						let toast: Toast = {
							type: 'error',
							title: 'Error',
							body: 'Error deleting contact: ' + error
						};
						this._dialogService.showToast(toast); 
					}
				);
			}
		}
	}
	ngOnDestroy() {
		// Clean up to avoid memory leak. unsubscribe from all stuff
		this.dataSubscript.unsubscribe()

	}
	
	public canDeactivate(): Promise<boolean> | boolean {
		if (this.ContactEditForm.form.dirty) {
			this._dialogService.setMessage("Are you sure you want to change tabs? Any unsaved information will be lost.");
			this.areYouSure.showSureModal();
		} else {
			return true;
		}
	}
}
