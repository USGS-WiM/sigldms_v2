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
    public dataTip: any;

    constructor(private _fb: FormBuilder) {
        this.newDataForm = _fb.group({
            'description': null,
            'portal_url': null, //'http://',
            'host_name': null
        }, {validator: this.AtLeastOneFieldValidator});
        this.dataTip = {
            description: "Describe your project data and where it resides (USGS NWIS, the Water Quality Portal, Access database, Excel spreadsheet, etc.). If your project uses multiple systems at different locations, enter each as a separate Data entry.",
            host: "Enter the entity, person, or organization that hosts or holds your data.",
            location: "If data is available online, provide the entire URL of the data’s location (be sure to include the ' http://'). Only enter one address."                
        }
    }

    ngOnInit() {     
        this.newData = { description: null, host_name: null, portal_url: null};        
    }

    // create new data host
    public AddData(valid: boolean, d: IDatahost){
        if (valid){
            if (d.portal_url === "http://") d.portal_url = null;
            this.newDataForm = this._fb.group({
                'description': null,
                'portal_url': null, 
                'host_name': null
            }, {validator: this.AtLeastOneFieldValidator});
            this.addDataHostEvent.emit(d);
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