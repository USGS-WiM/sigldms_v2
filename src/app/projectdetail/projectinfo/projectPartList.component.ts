import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IKeyword } from "app/shared/interfaces/lookups/keyword.interface";
import { DialogService } from "app/shared/services/dialog.service";

@Component({
  selector: 'projpart-list',
  template: `<div class="sigl-modal-form-group" ng-if="projectPart.length > 0">
                <label>Project {{projectThing}}s:</label>
                <ul>
                    <li style="list-style:none" *ngFor="let p of projectPart; let i = index">
                        <button type="button" (click)="removePart(p, i)" class="list-remove-item">
                            <i class="fa fa-times"></i>
                        </button>  {{p.term || p}}
                    </li>
                </ul>
            </div>

            <div class="sigl-modal-form-group">
                <label>
                    Add Project {{projectThing}}:
                    <span class="fa fa-question-circle sigl-tooltip" [ngbTooltip]="keyTip" placement="right"></span>                     
                </label>
                <input *ngIf="projectThing == 'Keyword'" (keyup.enter)="addThisPart($event)" class="input-with-add-button" name="newThing" type="text" placeholder="Enter one {{projectThing}} at a time" [(ngModel)]="newThing" />
                <input *ngIf="projectThing == 'Website'" (keyup.enter)="addThisPart($event)" class="input-with-add-button" httpprefix name="newThing" type="text"  placeholder="http://www.google.com" [(ngModel)]="newThing" />
                
                <button type="button" class="input-add-button" (click)="addThisPart()">Add</button>
            </div>
    `
//  styleUrls: ['app/todolist/todolist.css']
})

export class ProjPartList {
    @Input() projectPart: Array<any>;
    @Input() projectThing: string;
    @Output() thingToRemove = new EventEmitter<any>();
    @Output() allTheThings = new EventEmitter<any>();

    public newThing: string;    
    public keyTip: string;
    public allNewThings: Array<any>;

    constructor(private _dialogService: DialogService){}

    ngOnInit() {        

        this.allNewThings = this.projectThing == "Keyword" ? this.projectPart.map(x => Object.assign({}, x)) : this.projectPart.map(x => x);
        this.keyTip = this.projectThing == "Keyword" ? 
            "Type a keyword and then click add. Can add multiple keywords." : 
            "If your project has a website, enter the URL here. If information about your project can be found in multiple locations, add them here."
        this.newThing = "";             
    }

    public addThisPart(e) {
        if (this.newThing !== ""){
            if (this.projectThing == "Keyword") {
                this.projectPart.push({ keyword_id: 0, term:this.newThing });
                this.allNewThings.push({ keyword_id: 0, term:this.newThing });
            }
            else { 
                this.projectPart.push(this.newThing);
                this.allNewThings.push(this.newThing);
            }
            this.newThing = "";
            let sendThis = [this.projectThing, this.allNewThings];
            this.allTheThings.emit(sendThis);
        } else {
            alert("Need to add a value first");
        }
        var target = e.target;
        target.blur();
    }

    public removePart(term, i){
        this._dialogService.setMessage("Are you sure you want to delete this?");
        this._dialogService.setAreYouSureModal(true); //shows the modal. listener is projectinfo.modal.ts AreYouSureDialogResponse()

        let keywordToRemove = this.projectThing == "Keyword" ? {keyword_id: term.keyword_id, term: term.term} : term;
        let sendThis = [this.projectThing, keywordToRemove];
        this.thingToRemove.emit(sendThis);
    }
}