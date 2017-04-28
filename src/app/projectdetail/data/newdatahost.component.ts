import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { IDatahost } from "app/shared/interfaces/projects/datahost.interface";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'newdata',
  templateUrl: './newdatahost.component.html'
})

export class NewDataComponent implements OnInit {
    @Input() editing: boolean; //disable/enable create form section depending on if editing existing one above
    @Output() addDataHostEvent = new EventEmitter<IDatahost>(); // when they hit save, emit to projectdata.component
    @Output() errorMessagePleaseEvent = new EventEmitter<boolean>(); // need the error modal please
    public newDataForm: FormGroup; //myform
    public newData: IDatahost;
 
    constructor(private _fb: FormBuilder) {
        this.newDataForm = _fb.group({
            'description': null,
            'portal_url': null, //'http://',
            'host_name': null
        }, {validator: this.AtLeastOneFieldValidator})
    }

    ngOnInit() {     
        this.newData = { description: null, host_name: null, portal_url: null};        
    }

    // create new data host
    public AddData(valid: boolean, d: IDatahost){
        if (valid){
            if (d.portal_url === "http://") d.portal_url = null;
            this.newData = d;
            this.addDataHostEvent.emit(this.newData);
        } else {
            this.errorMessagePleaseEvent.emit(true);       
        }
        
    }   

    // custom  validator
    private AtLeastOneFieldValidator(group: FormGroup): {[key: string]: any} {
        let isAtLeastOne = false;
        if (group && group.controls) {
            for (const control in group.controls) {
                if (group.controls.hasOwnProperty(control) && group.controls[control].valid && group.controls[control].value && group.controls[control].value !== 'http://') {
                    isAtLeastOne = true;
                }
            }
        }
        return isAtLeastOne ? null : { 'required': true };
    }
}