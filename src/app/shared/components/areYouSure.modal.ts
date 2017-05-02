// ------------------------------------------------------------------------------
// ----- areYouSure.modal.ts ----------------------------------------------------
// ------------------------------------------------------------------------------

// copyright:   2016 WiM - USGS
//
// authors:  Tonia Roddick USGS Wisconsin Internet Mapping             
//
// purpose: modal used in all project tabs to make sure they want to leave the page if it's form is dirty

import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DialogService } from "app/shared/services/dialog.service";

@Component({
  selector: 'areYouSureModal',
  template: `  
    <ng-template #areYouSure let-c="close" let-d="dismiss">  
        <div class="modal-header">
            <h4 class="modal-title">WARNING</h4>
            <button type="button" class="close" aria-label="Close" (click)="d('Cross click')"><span aria-hidden="true">&times;</span></button>
        </div>
        <div class="modal-body">
            <p>Are you sure you want to change tabs? Any unsaved information will be lost.</p>
        </div>
        <div class="modal-footer">
            <button class="sigl-btn" (click)="c('Yes')">Yes</button>
            <button class="sigl-btn" (click)="c('Cancel')">Cancel</button>
            <!-- <button type="button" class="btn btn-secondary" (click)="c('Close click')">Close</button> -->
        </div>
    </ng-template>
    `
})

export class AreYouSureModal {   
    @ViewChild('areYouSure') public areYouSureModal; // : ModalDirective;  //modal for validator    
    private modalElement: any;
    @Output() moveOnOrNotEvent = new EventEmitter<boolean>(); // when they hit save, emit to projectdata.component
    public CloseResult:any;

    constructor(private _dialogService: DialogService, private _modalService: NgbModal){}
    
    ngOnInit() {
      //show the filter modal == Change Filters button was clicked in sidebar
        this._dialogService.showAreYouSureModal.subscribe((show: boolean) => {
            if (show) this.showSureModal();          
        }); 
        this.modalElement = this.areYouSureModal;
    }
     
    public showSureModal(): void {     
        this._modalService.open(this.modalElement, {backdrop: 'static', keyboard: false} ).result.then((result) =>{
            if (result == "Yes")
                this.moveOnOrNotEvent.emit(true);
        }, (reason) => {
            this.CloseResult = `Dismissed ${this.getDismissReason(reason)}`
        });
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) return 'by pressing ESC';
        else if (reason === ModalDismissReasons.BACKDROP_CLICK) return 'by clicking on a backdrop';
        else return  `with: ${reason}`;
    }
}