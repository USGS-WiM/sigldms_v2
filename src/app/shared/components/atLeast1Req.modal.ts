// ------------------------------------------------------------------------------
// ----- atLeast1Req.modal.ts ---------------------------------------------------
// ------------------------------------------------------------------------------

// copyright:   2016 WiM - USGS
//
// authors:  Tonia Roddick USGS Wisconsin Internet Mapping             
//
// purpose: modal used in Data Host and Publication tabs for needing one of 3 inputs populated

import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DialogService } from "app/shared/services/dialog.service";

@Component({
  selector: 'atLeast1Modal',
  template: `
      <ng-template #atLeastOne let-c="close" let-d="dismiss">
          <div class="modal-header">
            <h4 class="modal-title">ERROR</h4>                  
          </div>
          <div class="modal-body">
            You must populate at least one field.
          </div>
          <div class="modal-footer">
            <button type="button" class="sigl-btn" (click)="d('closed')">OK</button>
          </div>
        </ng-template>
      `
})

export class AtLeast1RequiredModal {   
    @ViewChild('atLeastOne') public atLeast1ReqModal; // : ModalDirective;  //modal for validator    
    private modalElement: any;
    public CloseResult: any;

    constructor(private _dialogService: DialogService, private _modalService: NgbModal){ }
    
    ngOnInit() {
      //show the filter modal == Change Filters button was clicked in sidebar
      this._dialogService.showAtLeast1Modal.subscribe((show: boolean) => {
          if (show) this.showReqModal();
      });
      this.modalElement = this.atLeast1ReqModal;
    }

    public showReqModal(): void {      
      this._modalService.open(this.modalElement).result.then((result) =>{
        // this is the solution for the first modal losing scrollability
            if (document.querySelector('body > .modal')) {
                document.body.classList.add('modal-open');
            }
            this.CloseResult = `Closed with: ${result}`;
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