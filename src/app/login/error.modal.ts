// ------------------------------------------------------------------------------
// ----- error.modal.ts ----------------------------------------------------
// ------------------------------------------------------------------------------

// copyright:   2016 WiM - USGS
// authors:  Tonia Roddick USGS Wisconsin Internet Mapping
// purpose: modal used when login fails

import { Component, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'loginErrorModal',
  template: `  
    <ng-template #loginErrorModal  id="loginErrorModal" let-c="close" let-d="dismiss">  
        <div class="modal-header">
            <h4 class="modal-title">ERROR</h4>            
        </div>
        <div class="modal-body">
            <p>{{modalMessage}}</p>
        </div>
        <div class="modal-footer">
            <button type="button" class="sigl-btn" (click)="c('Yes')">OK</button>
        </div>
    </ng-template>
    `
})

export class LoginErrorModal {    
    @ViewChild('loginErrorModal') public loginErrorModal;    
    @Input() message: string;
    @Output() modalResponseEvent = new EventEmitter<boolean>(); // when they hit save, emit to projectdata.component

    private modalElement: any;
    public CloseResult:any;
    public modalMessage: string;

    constructor(private _modalService: NgbModal){ }
    
    ngOnInit() {        
        this.modalElement = this.loginErrorModal;
    }
     
    public showErrorModal(): void {
        if (this.message.substring(0,3) == "401") 
            this.modalMessage = "The username or password is incorrect."
            
        this._modalService.open(this.modalElement, {backdrop: 'static', keyboard: false} ).result.then((result) =>{
            if (result == "Yes")
                this.modalResponseEvent.emit(true);
            else this.modalResponseEvent.emit(false);
        }, (reason) => {
            this.CloseResult = `Dismissed ${this.getDismissReason(reason)}`
        });
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) return 'by pressing ESC';
        else if (reason === ModalDismissReasons.BACKDROP_CLICK) return 'by clicking on a backdrop';
        else return  `with: ${reason}`;
    }

    ngOnDestroy() {
        this.modalElement = undefined;
    }
}