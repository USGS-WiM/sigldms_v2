// ------------------------------------------------------------------------------
// ----- projectinfo.modal.ts ----------------------------------------------------
// ------------------------------------------------------------------------------

// copyright:   2016 WiM - USGS
//
// authors:  Tonia Roddick USGS Wisconsin Internet Mapping             
//
// purpose: modal used to edit Project information

import { Component, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DialogService } from "app/shared/services/dialog.service";
import { IProject } from "app/shared/interfaces/projects/project.interface";
import { ProjectdetailService } from "app/projectdetail/projectdetail.service";
import { IFullproject } from "app/shared/interfaces/projects/fullProject.interface";
import { LookupsService } from "app/shared/services/lookups.service";
import { IProjDuration } from "app/shared/interfaces/lookups/projduration.interface";
import { IProjStatus } from "app/shared/interfaces/lookups/projstatus.interface";
import { IObjective } from "app/shared/interfaces/lookups/objective.interface";
import { IMonitorCoord } from "app/shared/interfaces/lookups/monitorcoord.interface";
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import {IMultiSelectOption, IMultiSelectSettings  } from "angular-2-dropdown-multiselect";
import { IKeyword } from "app/shared/interfaces/lookups/keyword.interface";

@Component({
  selector: 'editproject',
  templateUrl: './projectinfo.modal.html'
})

export class EditProjectModal {    
    @ViewChild('editProjectInfo') public editProjectInfoModal; // : ModalDirective;  //modal for validator    
    private modalElement: any;
    private invalidDatesElement: any;
    @Input() aProject: IProject; // will be the project being edited or 0 for create new
    @Input() projectParts:any;
    @Output() modalResponseEvent = new EventEmitter<boolean>(); // when they hit save, emit to projectdata.component
    
    public projInfoForm: FormGroup; //myform
    public CloseResult: any; //why the close the modal (not sure if I need this yet)
    public fullProject: IFullproject; 
    public projDurationList: Array<IProjDuration>; // dropdown
    public projStatusList: Array<IProjStatus>; // dropdown
    public projTips: any; // tooltips
    private tempProj: IProject; // holds original when editing in case they cancel

    public objectiveMulti: Array<IMultiSelectOption> = []; // dropdown multiselect contents
    public objectiveSelected: Array<number>; // holds ids of selected
    public monitorCoordsMulti: Array<IMultiSelectOption> = [];
    public monitorCoordsSelected: Array<number>; // holds ids of selected
    public multiSettings: IMultiSelectSettings;
    public aKeywordToRemove: IKeyword;
    public keywordsToRemove: Array<IKeyword>;
    public aURLtoRemove: string;

    constructor(private _projDetailService: ProjectdetailService, private _dialogService: DialogService, private _modalService: NgbModal,  private _lookupService: LookupsService, private _fb: FormBuilder) {
        this.projInfoForm = _fb.group({
            'name': new FormControl('', Validators.required),
            'proj_duration_id': new FormControl('', Validators.required),
            'proj_status_id': new FormControl('', Validators.required),
            'start_date': new FormControl(''),
            'end_date': new FormControl(''),
            'objectives': new FormControl([]),
            'monitorCoords': new FormControl([]),
            'description': new FormControl(''),
            'additional_info': new FormControl('')
        });
    }
    
    ngOnInit() { 
        this.keywordsToRemove = [];
        // Settings configuration
        this.multiSettings = {
            enableSearch: true,
            checkedStyle: 'fontawesome',
            buttonClasses: 'btn btn-default btn-block',
            dynamicTitleMaxItems: 3,
            displayAllSelectedText: true
        };
        this.modalElement = this.editProjectInfoModal;         
        // tooltips
        this.projTips = {            
            projDuration: "Select the category that best represents the length (or anticipated length) of your project.",
            projStatus: "Select the category that best describes the current status of your project.",
            startDate: "If you do not know the month/day, please select Jan 1.",
            endDate: "If project is ongoing, leave this field blank. If you do not know the month/day, please select Jan 1.",
            objectives: "Select the objectives that best describe the purpose of your project.",
            monCoords: "Use this field to associate your project with specific monitoring efforts and groups.",
            description: "Briefly describe the goals and/or details of your project.",
            addInfo: "Include any other information about your project here."
        }
        // when show == true, show the modal
        this._projDetailService.showProjectInfoModal.subscribe((show: boolean) => {
            if (show) this.showProjectModal();
        });

        this._projDetailService.fullProj().subscribe(fullProj => {
            this.fullProject = fullProj;
        });
        //get all the lookups I need
        this._lookupService.getProjDurations().subscribe((pd: Array<IProjDuration>) => {
             this.projDurationList = pd;    
        });
        this._lookupService.getProjStatus().subscribe((ps: Array<IProjStatus>) => {
             this.projStatusList = ps;    
        });
        this._lookupService.getObjectives().subscribe((o: Array<IObjective>) => {
            this.objectiveMulti = [];
            o.forEach((obj) => 
                this.objectiveMulti.push({id: obj.objective_type_id, name: obj.objective}));
        });
        this._lookupService.getMonCoords().subscribe((mc: Array<IMonitorCoord>) => {
            this.monitorCoordsMulti = [];
            mc.forEach((moniCoord) => 
                this.monitorCoordsMulti.push({id: moniCoord.monitoring_coordination_id, name: moniCoord.effort}));
        });
        if (this.aProject.project_id == undefined) this.showProjectModal();
    }
     
     // show the modal, populate the form and subscribe to form changes
    public showProjectModal(): void {
        if (this.aProject.project_id) 
            this.tempProj = Object.assign({}, this.aProject); // make a copy in case they cancel
        
        // populate form if aProject
        // NAME 
        this.projInfoForm.controls['name'].setValue(this.aProject.name);
        // PROJ_DURATION_ID
        this.projInfoForm.controls['proj_duration_id'].setValue(this.projDurationList.filter(c => c.proj_duration_id === this.aProject.proj_duration_id));
        this.projInfoForm.controls['proj_duration_id'].valueChanges.subscribe(pd => 
            this.aProject.proj_duration_id = pd 
        );
        // PROJ_STATUS_ID
        this.projInfoForm.controls['proj_status_id'].setValue(this.projStatusList.filter(c => c.proj_status_id === this.aProject.proj_status_id));
        this.projInfoForm.controls['proj_status_id'].valueChanges.subscribe(ps => 
            this.aProject.proj_status_id = ps
        );
        // START_DATE
        this.projInfoForm.controls['start_date'].setValue(this.aProject.start_date);
        /*this.projInfoForm.controls['start_date'].valueChanges.subscribe((sd:any) => {
            this.projInfoForm.controls['end_date'].updateValueAndValidity();
        });*/
     
        // END_DATE
        this.projInfoForm.controls['end_date'].setValue(this.aProject.end_date);
        /* this.projInfoForm.controls['end_date'].valueChanges.subscribe((sd:any) => {
            this.projInfoForm.controls['start_date'].updateValueAndValidity();
        });*/
        //PROJECT OBJECTIVES
        let proObjsIDs: Array<number> = [];
        this.projectParts.ProjObjs.forEach(po => {proObjsIDs.push(po.objective_type_id);}); // push in each id for preselecting
        this.projInfoForm.controls['objectives'].setValue(proObjsIDs);
        this.projInfoForm.controls['objectives'].valueChanges   
            .subscribe((selectedOptions) => {
                this.objectiveSelected = selectedOptions; //contains all the selected Options TODO
            });        
        // PROJECT MONITOR COORDINATION
        let projmcIDs: Array<number> = [];
        this.projectParts.ProjMon.forEach(mc => { projmcIDs.push(mc.monitoring_coordination_id); }) // push in each id for preselecting
        this.projInfoForm.controls['monitorCoords'].setValue(projmcIDs);
        this.projInfoForm.controls['monitorCoords'].valueChanges   
            .subscribe((selectedOptions) => {
                this.monitorCoordsSelected = selectedOptions; //contains all the selected Options TODO
            });
        // DESCRIPTION
        this.projInfoForm.controls['description'].setValue(this.aProject.description);

        // PROJECT KEYWORDS & PROJECT URLS  handled by projectPartList.component

        // ADDITIONAL_INFO
        this.projInfoForm.controls['additional_info'].setValue(this.aProject.additional_info);

       
        // open the modal now
        this._modalService.open(this.modalElement, {backdrop: 'static', keyboard: false, size: 'lg'} ).result.then((valid) =>{           
            let closeResult = `Closed with: ${valid}`;
            if (valid){
                //its valid
                let areYouSure = "what?";
                this.modalResponseEvent.emit(true);
            } else {
                //invalid. do something about it
            }            
        }, (reason) => {
            this.CloseResult = `Dismissed ${this.getDismissReason(reason)}`
        });
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) return 'by pressing ESC';
        else if (reason === ModalDismissReasons.BACKDROP_CLICK) return 'by clicking on a backdrop';
        else return  `with: ${reason}`;
    }

    // each time they remove a key this gets updated, then the areYouSureDialogResponse function handles the are you sure modal close
    public updatePrjPartToRemove(e){
        //  [term, this.thingToRemove];
        if (e[1] == "Keyword") this.aKeywordToRemove = e;
        else this.aURLtoRemove = e;
    }
      // response from dialog (either want to leave here without saving edits or want to delete datahost)
  public AreYouSureDialogResponse(val:boolean){
    this._dialogService.setAreYouSureModal(false);   
    //if they clicked Yes
    if (val) {
        let test = this.aKeywordToRemove;
         //delete the keyword (temporarily)
        this.keywordsToRemove.push(this.aKeywordToRemove);
        this.aKeywordToRemove = undefined; //clear it for the next one
        //store it to pass back up to delete when SAVING
        this.projectParts.ProjKeys.splice(this.projectParts.ProjKeys.indexOf(test), 1);
    }
  }

    
}