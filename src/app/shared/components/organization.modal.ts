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

@Component({
    selector: 'organizationModal',
    template: `
        <ng-template #organization let-c="close" let-d="dismiss">
            <div class="modal-header">
                <h4 class="modal-title">ORGANIZATIONS</h4>                  
            </div>
            <div class="modal-body">
            <div class="sigl-modal-form-group">
                <label for="chosenOrg">Organization:</label>
                <select class="form-control" name="chosenOrg" [(ngModel)]="chosenOrg" (ngModelChange)="onOrgChange($event)">
                    <option value=""></option>
                    <option *ngFor="let o of orgDrop | sort: 'organization_name'" [ngValue]="o.organization_id">{{o.organization_name}}</option>
                </select>
            </div>
            <br/>
            <div class="sigl-modal-form-group">
                <label for="chosenDiv">Division:</label>
                <select class="form-control" name="chosenDiv" [(ngModel)]="chosenDiv" (ngModelChange)="onDivChange($event)">
                    <option value=""></option>
                    <option *ngFor="let d of orgDivisions | sort: 'division_name'" [ngValue]="d.division_id">{{d.division_name}}</option>
                </select>
            </div>
            <br/>
            <div class="sigl-modal-form-group">
                <label for="chosenSec">Section:</label>
                <select class="form-control" name="chosenSec" [(ngModel)]="chosenSec">
                    <option value=""></option>
                    <option *ngFor="let s of divSections | sort: 'section_name'" [ngValue]="s.section_id">{{s.section_name}}</option>
                </select>
            </div>
            <br/>
            Request that an organization name be edited or deleted.
          </div>
          <div class="modal-footer">
            <button type="button" class="sigl-btn" (click)="c('done')">Close</button>
          </div>
        </ng-template>
      `
})

export class OrganizationModal {
    @ViewChild('organization') public organizationModal;
    @Input() orgDrop: Array<IOrganization>;
    @Input() divDrop: Array<IDivision>;
    @Input() secDrop: Array<ISection>;
    private modalElement: any;
    public CloseResult: any;
    private modalSubscript;
    
    public orgDivisions:Array<IDivision>; //populate when they change org
    public divSections:Array<ISection>     //populate when they change div
    
    public chosenOrg: any; // ngModel
    public chosenDiv: any; // ngModel
    public chosenSec: any; // ngModel

    constructor(private _dialogService: DialogService, private _modalService: NgbModal) {
        this.orgDrop = []; this.divDrop = []; this.secDrop = [];
        this.orgDivisions = []; this.divSections = [];
     }

    ngOnInit() {        
        //show the filter modal == Change Filters button was clicked in sidebar
       /* this.modalSubscript = this._dialogService.showOrganizationModal.subscribe((show: boolean) => {
            if (show) this.showOrgModal();
        });*/
        this.modalElement = this.organizationModal;
    }

    public showOrgModal(): void {
        //  this.organizationList = this.orgDrop;
        this._modalService.open(this.modalElement).result.then((result) => {
            // this is the solution for the first modal losing scrollability
            if (document.querySelector('body > .modal')) {                
                document.body.classList.add('modal-open');
            }
            // this.chosenOrg, this.chosenDiv, this.chosenSec will have the id's chosen

            this.CloseResult = `Closed with: ${result}`;
        }, (reason) => {
            this.CloseResult = `Dismissed ${this.getDismissReason(reason)}`
        });
    }

    // org was changed, update divs
    public onOrgChange(e){
        this.orgDivisions = this.divDrop.filter((d:IDivision) => {return d.org_id == e});
    }
    
    // org was changed, update divs
    public onDivChange(e){
        this.divSections = this.secDrop.filter((s:ISection) => {return s.div_id == e});
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