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
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { IMultiSelectOption, IMultiSelectSettings  } from "angular-2-dropdown-multiselect";
import { IKeyword } from "app/shared/interfaces/lookups/keyword.interface";

@Component({
  selector: 'editproject',
  templateUrl: './projectinfo.modal.html'
})

export class EditProjectModal {    
    @ViewChild('editProjectInfo') public editProjectInfoModal; // : ModalDirective;  //modal for validator    
    private modalElement: any;
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

    public aKeywordToRemove: IKeyword; //removing keyword emitter hits function that populates this so that when AreYouSure comes back true, will have value to store for deletion
    public keywordsToRemove: Array<IKeyword>; // storage of keywords removed to delete at POST/PUT time
    public newestKeywords: Array<IKeyword>; //passed up from projectPartlist everytime one is added or removed

    public aURLToRemove: string; //removing url emitter hits function that populates this so that when AreYouSure comes back true, will have value to store for deletion
    public urlsToRemove: Array<string>; // storage of urls removed to delete at POST/PUT time
    public newestURLs: Array<string>;    

    public undetermined: boolean; // enable/disable end date based on proj_status_id

    constructor(private _projDetailService: ProjectdetailService, private _dialogService: DialogService, 
                private _modalService: NgbModal,  private _lookupService: LookupsService, private _fb: FormBuilder) {
                    
        this.projInfoForm = _fb.group({
            projectGrp: _fb.group({
                'project_id': new FormControl(null),
                'name': new FormControl(null, Validators.required),
                'proj_duration_id': new FormControl(null, Validators.required),
                'proj_status_id': new FormControl(null, Validators.required),
                'start_date': new FormControl(null),
                'end_date': new FormControl({value: null, disabled: false}),
                'description': new FormControl(null),
                'additional_info': new FormControl(null),
                'url': new FormControl(null), //use this.newestURLs to join with "|" separator 
                'data_manager_id': new FormControl(null),
                'science_base_id': new FormControl(null),
                'ready_flag': new FormControl(null),
                'created_stamp': new FormControl(null),
                'last_edited_stamp': new FormControl(null)
            }),
            'objectives': new FormControl([]),
            'monitorCoords': new FormControl([])
            
        });
    }
    
    ngOnInit() { 
        this.undetermined = false;
        this.newestKeywords = []; this.newestURLs = [];
        this.keywordsToRemove = []; this.urlsToRemove = [];
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
        //if editing, make a copy in case they cancel, send back original
        if (this.aProject.project_id) 
            this.tempProj = Object.assign({}, this.aProject); // make a copy in case they cancel
        
        // populate form        
        let projectControlGrp = <FormArray>this.projInfoForm.controls['projectGrp'];
        
        // PROJECT_ID
        if (this.aProject.project_id) {
            projectControlGrp.controls['project_id'].setValue(this.aProject.project_id);
            projectControlGrp.controls['science_base_id'].setValue(this.aProject.science_base_id);
            projectControlGrp.controls['ready_flag'].setValue(this.aProject.ready_flag || 0);
            projectControlGrp.controls['data_manager_id'].setValue(this.aProject.data_manager_id);
             projectControlGrp.controls['created_stamp'].setValue(this.aProject.created_stamp);
        }
        // NAME 
        projectControlGrp.controls['name'].setValue(this.aProject.name);
        // PROJ_DURATION_ID
        projectControlGrp.controls['proj_duration_id'].setValue(this.projDurationList.filter(c => c.proj_duration_id === this.aProject.proj_duration_id)[0]);
        
        // PROJ_STATUS_ID
        projectControlGrp.controls['proj_status_id'].setValue(this.projStatusList.filter(c => c.proj_status_id === this.aProject.proj_status_id)[0]);
        projectControlGrp.controls['proj_status_id'].valueChanges.subscribe(ps => {
          //  this.aProject.proj_status_id = ps;
            if (ps == 1) {
                if (projectControlGrp.controls['end_date'].value !== undefined && projectControlGrp.controls['end_date'].value !== null && projectControlGrp.controls['end_date'].value !== "") {
                        projectControlGrp.controls['end_date'].setValue(undefined);
                    }
                    projectControlGrp.get('end_date').disable();
                    this.undetermined = true;
             } else {
                 projectControlGrp.get('end_date').enable();
                 this.undetermined = false;
             }
        });
        // START_DATE
        projectControlGrp.controls['start_date'].setValue(this.aProject.start_date || null);     
        // END_DATE
        projectControlGrp.controls['end_date'].setValue(this.aProject.end_date || null);
        // PROJECT OBJECTIVES
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
        // DESCRIPTION
        projectControlGrp.controls['description'].setValue(this.aProject.description);

        // PROJECT KEYWORDS & PROJECT URLS  handled by projectPartList.component

        // ADDITIONAL_INFO
        projectControlGrp.controls['additional_info'].setValue(this.aProject.additional_info);
       
        // open the modal now
        this._modalService.open(this.modalElement, {backdrop: 'static', keyboard: false, size: 'lg'} ).result.then((valid) =>{           
            let closeResult = `Closed with: ${valid}`;           
            if (valid){
                // save the project
                let updatedProject: IProject = this.projInfoForm.controls['projectGrp'].value;
                if (updatedProject.start_date !== null)
                    updatedProject.start_date = new Date(updatedProject.start_date['year'], updatedProject.start_date['month'], updatedProject.start_date['day']);
                if (updatedProject.end_date !== null)
                    updatedProject.end_date = new Date(updatedProject.end_date['year'], updatedProject.end_date['month'], updatedProject.end_date['day']);
    
                updatedProject.last_edited_stamp = new Date();
                //what about READY_FLAG ??? 
                
                
                
                let worked = "maybe";
                
                // this.newestKeywords (all for this proj)   this.keywordsToRemove

                //its valid        
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

    // each time they add/remove a key or url this gets updated, then the areYouSureDialogResponse function handles the are you sure modal close
    public updatePrjPart(e){
        //  [term, this.thingToRemove];
        if (e[0] == "Keyword") this.newestKeywords = e[1];
        else {
            this.newestURLs = e[1];
            let projectControlGrp = <FormArray>this.projInfoForm.controls['projectGrp'];
            projectControlGrp.controls['url'].setValue(e[1].join("|"));
        }
    }

    //they removed a keyword or url from projectPartList.component, output emitter sent it here to add to array
    public removeKeyorURL(e){
        this.aKeywordToRemove = undefined; 
        this.aURLToRemove = undefined;
        if (e[0] == "Keyword") this.aKeywordToRemove = e[1];
        else {
            this.aURLToRemove = e[1];            
        }
    }

    // response from dialog (want to delete the keyword or url)
    public AreYouSureDialogResponse(val:boolean){
        this._dialogService.setAreYouSureModal(false);   
        //if they clicked Yes
        if (val) {
            //keyword or url?
            if (this.aKeywordToRemove !== undefined) {
                //delete the keyword (temporarily)
                this.keywordsToRemove.push(this.aKeywordToRemove);
                //store it to pass back up to delete when SAVING
                let keyIndex = this.projectParts.ProjKeys.findIndex(x => x.keyword_id == this.aKeywordToRemove.keyword_id && x.term == this.aKeywordToRemove.term);
                this.projectParts.ProjKeys.splice(keyIndex, 1);
            } else {
                //it's a url
                //delete the url (temporarily)
                this.urlsToRemove.push(this.aURLToRemove);
                //store it to pass back up to delete when SAVING
                let urlIndex = this.projectParts.ProjUrls.findIndex(x => x == this.aURLToRemove);
                this.projectParts.ProjUrls.splice(urlIndex, 1);

                let projectControlGrp = <FormArray>this.projInfoForm.controls['projectGrp'];
                projectControlGrp.controls['url'].setValue(this.projectParts.ProjUrls.join("|"));
            }
        }
    }
    

}