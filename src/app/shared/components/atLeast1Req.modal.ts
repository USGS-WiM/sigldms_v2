import { Component, ViewChild } from '@angular/core';
import { ModalDirective } from "ngx-bootstrap/modal";
import { AuthService } from "app/shared/services/auth.service";

@Component({
  selector: 'atLeast1Modal',
  template: `
    <div bsModal #atLeast1ReqModal="bs-modal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-sm">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">ERROR</h4>                  
          </div>
          <div class="modal-body">
            You must populate at least one field.
          </div>
          <div class="modal-footer">
            <button class="sigl-btn" (click)="hideModal()">OK</button>
          </div>
        </div>
      </div>
    </div>`
})

export class AtLeast1RequiredModal {   
    @ViewChild('atLeast1ReqModal') public atLeast1ReqModal: ModalDirective;  //modal for validator    
 //   private isOpen: boolean;
    constructor(private _authService: AuthService){ 
//      this.isOpen = false;
    }
    
    ngOnInit() {
      //show the filter modal == Change Filters button was clicked in sidebar
        this._authService.showAtLeast1Modal.subscribe((show: boolean) => {
            if (show) this.showModal();
            //if (!show && this.isOpen) this.hideModal();
        }); 
    }
  

    public showModal(): void {
      //this.isOpen = true;
      // this.atLeast1ReqModal.show();
      this.atLeast1ReqModal.show();
    }
    public hideModal():void{      
      this.atLeast1ReqModal.hide();
    }

}