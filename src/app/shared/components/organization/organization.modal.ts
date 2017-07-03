// ------------------------------------------------------------------------------
// ----- organization.modal.ts ---------------------------------------------------
// ------------------------------------------------------------------------------

// copyright:   2016 WiM - USGS
//
// authors:  Tonia Roddick USGS Wisconsin Internet Mapping             
//
// purpose: modal used in Project Organization, Contacts, and Settings/Organizations to add/create organizations to use

import { Component, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DialogService } from "app/shared/services/dialog.service";
import { IOrganization } from "app/shared/interfaces/lookups/organization.interface";
import { ISection } from "app/shared/interfaces/lookups/section.interface";
import { IDivision } from "app/shared/interfaces/lookups/division.interface";
import { IOrganizationresource } from "app/shared/interfaces/projects/orgresource.interface";

@Component({
    selector: 'organizationModal',
    templateUrl: 'organization.modal.html'
})

export class OrganizationModal {
    
    @ViewChild('organization') public organizationModal;
    @Input() orgDrop: Array<IOrganization>; // organizations array
    @Input() divDrop: Array<IDivision>; // divisions array
    @Input() secDrop: Array<ISection>; // sections array
    @Input() selectedOrg: IOrganizationresource; // chosen values from caller
    @Output() modalResponseEvent = new EventEmitter<any>(); // when they hit Close, emit all new drops to caller
    private modalElement: any;
    public CloseResult: any;
    private modalSubscript;
    
    public orgDivisions:Array<IDivision>; //populate when they change org
    public divSections:Array<ISection>     //populate when they change div
    
    // ngModel values
    public chosenOrg: number; 
    public chosenDiv: number;
    public chosenSec: number;
    
    // boolean to show/hide new part inputs
    public showAddOrgInput: boolean; 
    public showAddDivInput: boolean;
    public showAddSecInput: boolean;
    public NewOrgName: string; //holds new organization value
    public NewDivName: string; // holds new division name
    public NewSecName: string; // holds new section name

    constructor(private _dialogService: DialogService, private _modalService: NgbModal) {
        this.orgDrop = []; this.divDrop = []; this.secDrop = [];
        this.orgDivisions = []; this.divSections = [];
     }

    ngOnInit() {       
        this.showAddOrgInput = false;
        this.showAddDivInput = false;
        this.showAddSecInput = false;
        this.modalElement = this.organizationModal;        
    }

    public showOrgModal(): void {
        this.setPresets();
        
        //open the modal
        this._modalService.open(this.modalElement, {backdrop: 'static', keyboard: false} ).result.then((result) => {
            // this is the solution for the first modal losing scrollability
            if (document.querySelector('body > .modal')) {                
                document.body.classList.add('modal-open');
            }
            // this.chosenOrg, this.chosenDiv, this.chosenSec will have the id's chosen emit it out
            let allNewDrops = [this.orgDrop, this.divDrop, this.secDrop, this.chosenOrg, this.chosenDiv, this.chosenSec];
            this.modalResponseEvent.emit(allNewDrops);
            this.CloseResult = `Closed with: ${result}`;
        }, (reason) => {
            this.CloseResult = `Dismissed ${this.getDismissReason(reason)}`
        });
    }
    public setPresets(){
        // if selectedOrg parts are > 0, they chose something, make it selected here
        if (this.selectedOrg.org_id > -1 || this.chosenOrg !== undefined) {
            this.chosenOrg = this.selectedOrg.org_id > -1 ? this.selectedOrg.org_id : this.chosenOrg;
            this.orgDivisions = this.divDrop.filter((d:IDivision) => {return d.org_id == this.chosenOrg; });
        }
        if (this.selectedOrg.div_id > -1|| this.chosenDiv !== undefined) {
            this.chosenDiv = this.selectedOrg.div_id > -1 ? this.selectedOrg.div_id : this.chosenDiv;
            this.divSections = this.secDrop.filter((s:ISection) => {return s.div_id == this.chosenDiv; });
        }        
        if (this.selectedOrg.sec_id > -1|| this.chosenSec !== undefined) {            
            this.chosenSec = this.selectedOrg.sec_id > -1 ? this.selectedOrg.sec_id : this.chosenSec;
        }        
    }
    // org was changed, update divs
    public onOrgChange(e){
        this.orgDivisions = this.divDrop.filter((d:IDivision) => {return d.org_id == e});
    }
    
    // org was changed, update divs
    public onDivChange(e){
        this.divSections = this.secDrop.filter((s:ISection) => {return s.div_id == e});
    }
    
    // add new organization name was clicked
    public addOrgName() {
        // show input
        this.showAddOrgInput = true;
        // clear all selected
        this.chosenOrg = -1;
        this.chosenDiv = -1;
        this.orgDivisions = [];
        this.chosenSec= -1;
        this.divSections = [];
    }
    

    // add new division name was clicked
    public addDivName(){
        // show input
        this.showAddDivInput = true;
        // clear all selected
        this.chosenDiv = -1;
        this.orgDivisions = [];
        this.chosenSec= -1;
        this.divSections = [];
    }
    
    // add new section name was clicked
    public addSecName(){
        // show input
        this.showAddSecInput = true;
        // clear all selected
        this.chosenSec= -1;
        this.divSections = [];
    }
    
    //they want to add this new organization/division/section
    public postOrgPart(whichOne: string, Name: string){
        if (Name !== "" && Name !== undefined){
            switch(whichOne){
                case 'org':
                    let orgToPost: IOrganization = { organization_name: Name };
                    //post org
                    this._dialogService.postOrganization(orgToPost).subscribe((result: IOrganization) => {
                        let alreadyExists: Array<IOrganization> = this.orgDrop.filter(o=> o.organization_id == result.organization_id);
                        if (alreadyExists.length === 0)
                            this.orgDrop.push(result);
                        // make this one selected
                        this.chosenOrg = result.organization_id;
                        this.NewOrgName = "";
                        this.showAddOrgInput = false;
                    });
                break;
                case 'div':
                    let divToPost: IDivision = { division_name: Name, org_id: this.chosenOrg };
                    //post org
                    this._dialogService.postDivision(divToPost).subscribe((result: IDivision) => {
                        let alreadyExists: Array<IDivision> = this.divDrop.filter(o=> o.division_id == result.division_id && o.org_id == result.org_id);
                        if (alreadyExists.length === 0)
                            this.divDrop.push(result);
                        // make this one selected
                        this.chosenDiv = result.division_id;
                        // update the orgDivisions
                        this.orgDivisions = this.divDrop.filter((d:IDivision) => {return d.org_id == this.chosenOrg; });
                        this.NewDivName = "";
                        this.showAddDivInput = false;
                    });
                    break;
                case 'sec':
                    let secToPost: ISection = { section_name: Name, div_id: this.chosenDiv };
                    //post org
                    this._dialogService.postSection(secToPost).subscribe((result: ISection) => {
                        let alreadyExists: Array<ISection> = this.secDrop.filter(s => s.section_id === result.section_id && s.div_id == result.div_id);
                        if (alreadyExists.length === 0)
                            this.secDrop.push(result);

                        // make this one selected
                        this.chosenSec = result.section_id;
                        // update the divSections
                        this.divSections = this.secDrop.filter((s:ISection) => {return s.div_id == this.chosenDiv; });

                        this.NewSecName = "";
                        this.showAddSecInput = false;
                    });
                    break;
            }
        }
    }
    // they clicked cancel on adding new
    public neverMind(whichOne: string){
        switch(whichOne){
            case 'org':
                this.showAddOrgInput = false;
                break;
            case 'div':
                this.showAddDivInput = false;
                break;
            case 'sec':
                this.showAddSecInput = false;
                break;
        }        
        this.setPresets();
    }
    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) return 'by pressing ESC';
        else if (reason === ModalDismissReasons.BACKDROP_CLICK) return 'by clicking on a backdrop';
        else return `with: ${reason}`;
    }
    ngOnDestroy() {
     //   this.modalSubscript.unsubscribe();
    }
}