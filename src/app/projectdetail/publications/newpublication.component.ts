import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { IPublication } from "app/shared/interfaces/projects/publication.interface";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'newpub',
  templateUrl: './newpublication.component.html'
})

export class NewPublicationComponent implements OnInit {
    @Input() editing: boolean; //disable/enable create form section depending on if editing existing one above
    @Output() addPublicationEvent = new EventEmitter<IPublication>(); // when they hit save, emit to projectdata.component
    @Output() errorMessagePleaseEvent = new EventEmitter<boolean>(); // need the error modal please
    public newPubForm: FormGroup; //myform
    public newPub: IPublication;
    public pubTip: any;

    constructor(private _fb: FormBuilder) {
        this.newPubForm = _fb.group({
            'description': null,
            'url': null, //'http://',
            'title': null
        }, {validator: this.AtLeastOneFieldValidator});
        this.pubTip = {
            title: "Enter the title of your publication in this field. Do not include any other information.",
            description: "Enter the citation or briefly describe the content and format of your publication.",
            url: "If the publication is online, enter the URL. Otherwise, provide information on how to obtain a copy of the publication."                
        }
    }

    ngOnInit() {     
        this.newPub = { description: null, title: null, url: null};        
    }

    // create new data host
    public AddPublication(valid: boolean, d: IPublication){
        if (valid){
            if (d.url === "http://") d.url = null;
            this.newPubForm = this._fb.group({
                'description': null,
                'url': null, 
                'title': null
            }, {validator: this.AtLeastOneFieldValidator});
            this.addPublicationEvent.emit(d);
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