// ------------------------------------------------------------------------------
// ----- projectinfo.modal.ts ----------------------------------------------------
// ------------------------------------------------------------------------------

// copyright:   2016 WiM - USGS
// authors:  Tonia Roddick USGS Wisconsin Internet Mapping
// purpose: modal used to edit Project information

import { Component, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { IMultiSelectOption, IMultiSelectSettings  } from "angular-2-dropdown-multiselect";
import { IProject } from "app/shared/interfaces/projects/project.interface";
import { IFullproject } from "app/shared/interfaces/projects/fullProject.interface";
import { ProjectdetailService } from "app/projectdetail/projectdetail.service";
import { LookupsService } from "app/shared/services/lookups.service";
import { IProjDuration } from "app/shared/interfaces/lookups/projduration.interface";
import { IProjStatus } from "app/shared/interfaces/lookups/projstatus.interface";
import { IObjective } from "app/shared/interfaces/lookups/objective.interface";
import { IMonitorCoord } from "app/shared/interfaces/lookups/monitorcoord.interface";
import { IKeyword } from "app/shared/interfaces/lookups/keyword.interface";

@Component({
  selector: 'editproject',
  templateUrl: './projectinfo.modal.html'
})

export class EditProjectModal {    
    @ViewChild('editProjectInfo') public editProjectInfoModal; // : ModalDirective;  //modal for validator    
    private modalElement: any;
    @Input() modalFullProject: IFullproject; // will be the project being edited or 0 for create new
    @Input() modalProjectParts: any; // holds the project stuff (MonCoords, Objectives, Keywords)
    @Output() updatedVersion = new EventEmitter<any>(); // when they hit save or create, emit to projectdata.component the new stuff
    
    public projInfoForm: FormGroup; //myform
    public CloseResult: any; //why the close the modal (not sure if I need this yet)
  //  public fullProject: IFullproject; 
    public projDurationList: Array<IProjDuration>; // dropdown
    public projStatusList: Array<IProjStatus>; // dropdown
    public projTips: any; // tooltips
    private tempProj: IFullproject; // holds original when editing in case they cancel
    public multiSettings: IMultiSelectSettings;
    public undetermined: boolean; // enable/disable end date based on proj_status_id

    private originalProjObjsIDs: Array<number>; // holds initial project objectiveIDs to use when updating (compares to objectiveSelected that updates onChange)
    private objectivesChosenObjectArray: Array<IObjective>; // need to keep this updated with the objective objects
    public objectiveMulti: Array<IMultiSelectOption> = []; // dropdown multiselect contents
    public objectiveSelected: Array<number>; // holds ids of selected

    private originalProjMonCoordIDs: Array<number>; // holds initial project monCoordIDs to use when updating (compares to monitorCoordsSelected that updates onChange)
    public monitorsChosenObjectArray: Array<IMonitorCoord>; // need to keep this updated with the monCoord objects
    public monitorCoordsMulti: Array<IMultiSelectOption> = []; // dropdown multiselect contents
    public monitorCoordsSelected: Array<number>; // holds ids of selected
    
    public aKeywordToRemove: IKeyword; //removing keyword emitter hits function that populates this so that when AreYouSure comes back true, will have value to store for deletion
    public keywordsToRemove: Array<IKeyword>; // storage of keywords removed to delete at POST/PUT time
    public newestKeywords: Array<IKeyword>; //passed up from projectPartlist everytime one is added or removed
    
    public aURLToRemove: string; //removing url emitter hits function that populates this so that when AreYouSure comes back true, will have value to store for deletion
    public urlsToRemove: Array<string>; // storage of urls removed to delete at POST/PUT time
    public newestURLs: Array<string>;    
    
    private infoModalSubscript;
    private projSubscript;
    private durSubscript;
    private statSubscript;
    private keysSubscript;
    private objSubscript;
    private monSubscript;
    private putProjsubscript;
    private deleteProjKeysubscript;
    private postProjKeysubscript;
    private postProjObjsubscript;
    private deleteProjObjsubscript;
    private postProjMonsubscript;
    private deleteProjMonsubscript;

    constructor(private _projDetService: ProjectdetailService, private _modalService: NgbModal,
                private _lookupService: LookupsService, private _fb: FormBuilder) {
                    
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
        this.infoModalSubscript = this._projDetService.showProjectInfoModal.subscribe((show: boolean) => {
            if (show) this.showProjectModal();
        });

      /* not sure I need this since the fullProject is passed in via opening the modal
        this.projSubscript = this._projDetService.getFullProj().subscribe(fullProj => {
            this.fullProject = fullProj;
        });*/
        //get all the lookups I need
        this.durSubscript = this._lookupService.getProjDurations().subscribe((pd: Array<IProjDuration>) => {
             this.projDurationList = pd;    
        });
        this.statSubscript = this._lookupService.getProjStatus().subscribe((ps: Array<IProjStatus>) => {
             this.projStatusList = ps;    
        });
        this.objSubscript = this._lookupService.getObjectives().subscribe((o: Array<IObjective>) => {
            this.objectiveMulti = [];
            o.forEach((obj) => 
                this.objectiveMulti.push({id: obj.objective_type_id, name: obj.objective}));
        });
        this.monSubscript = this._lookupService.getMonCoords().subscribe((mc: Array<IMonitorCoord>) => {
            this.monitorCoordsMulti = [];
            mc.forEach((moniCoord) => 
                this.monitorCoordsMulti.push({id: moniCoord.monitoring_coordination_id, name: moniCoord.effort}));
        });        
        if (this.modalFullProject.ProjectId == undefined) this.showProjectModal();
    }
     
     // show the modal, populate the form and subscribe to form changes
    public showProjectModal(): void {
        //if editing, make a copy in case they cancel, send back original
        if (this.modalFullProject.ProjectId) 
            this.tempProj = Object.assign({}, this.modalFullProject); // make a copy in case they cancel
        
        // populate form        
        let projectControlGrp = <FormArray>this.projInfoForm.controls['projectGrp'];
        
        // PROJECT_ID
        if (this.modalFullProject.ProjectId) {
            projectControlGrp.controls['project_id'].setValue(this.modalFullProject.ProjectId);
            projectControlGrp.controls['science_base_id'].setValue(this.modalFullProject.ScienceBaseId);
            projectControlGrp.controls['ready_flag'].setValue(this.modalFullProject.ready_flag || 0);
            projectControlGrp.controls['data_manager_id'].setValue(this.modalFullProject.DataManagerId);
            projectControlGrp.controls['created_stamp'].setValue(this.modalFullProject.created_stamp);
        }
        // NAME 
        projectControlGrp.controls['name'].setValue(this.modalFullProject.Name);
        // PROJ_DURATION_ID
        projectControlGrp.controls['proj_duration_id'].setValue(this.projDurationList.filter(c => c.proj_duration_id === this.modalFullProject.duration_id)[0]);
        
        // PROJ_STATUS_ID
        projectControlGrp.controls['proj_status_id'].setValue(this.projStatusList.filter(c => c.proj_status_id === this.modalFullProject.status_id)[0]);
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
        if (this.modalFullProject.StartDate !== undefined && this.modalFullProject.StartDate.toString() !== "") {
            let stDate: Date = new Date(this.modalFullProject.StartDate);
            projectControlGrp.controls['start_date'].setValue({year: stDate.getFullYear(), month: stDate.getMonth()+1, day: stDate.getDate()});
        } else projectControlGrp.controls['start_date'].setValue(null);  
        projectControlGrp.controls['start_date'].valueChanges.subscribe((newVal) => {
            //if value is cleared, set it to null so that it stays valid on save
            if (newVal == "") projectControlGrp.controls['start_date'].setValue(null);
        });
        // END_DATE
        if (this.modalFullProject.EndDate !== undefined && this.modalFullProject.EndDate.toString() !== "") {
            let eDate: Date = new Date(this.modalFullProject.EndDate);
            projectControlGrp.controls['end_date'].setValue({year: eDate.getFullYear(), month: eDate.getMonth()+1, day: eDate.getDate()});
        } else projectControlGrp.controls['end_date'].setValue(null);
        projectControlGrp.controls['end_date'].valueChanges.subscribe((newVal) => {
            //if value is cleared, set it to null so that it stays valid on save
            if (newVal == "") projectControlGrp.controls['end_date'].setValue(null);
        });
        // PROJECT OBJECTIVES
        this.objectiveSelected = this.modalProjectParts.ProjObjs.map(x => x.objective_type_id);
        this.originalProjObjsIDs = this.modalProjectParts.ProjObjs.map(x => x.objective_type_id);
        this.objectivesChosenObjectArray = this.modalProjectParts.ProjObjs.map(x => Object.assign({}, x));
        this.projInfoForm.controls['objectives'].setValue(this.modalProjectParts.ProjObjs.map(x => x.objective_type_id));
        this.projInfoForm.controls['objectives'].valueChanges
            .subscribe((selectedOptions) => {
                this.objectiveSelected = selectedOptions; //contains all the selected Options
                this.objectivesChosenObjectArray = []; // keep the objects updated for later
                selectedOptions.forEach(o => {
                    let thisObj = this.objectiveMulti.filter(om=>{return om.id == o;})[0];
                    this.objectivesChosenObjectArray.push({objective_type_id: thisObj.id, objective: thisObj.name});
                });
            });

        // PROJECT MONITOR COORDINATION
        this.monitorCoordsSelected = this.modalProjectParts.ProjMon.map(m => m.monitoring_coordination_id);
        this.originalProjMonCoordIDs = this.modalProjectParts.ProjMon.map(m => m.monitoring_coordination_id);
        this.monitorsChosenObjectArray = this.modalProjectParts.ProjMon.map(x => Object.assign({}, x));
        this.projInfoForm.controls['monitorCoords'].setValue(this.modalProjectParts.ProjMon.map(m => m.monitoring_coordination_id));
        this.projInfoForm.controls['monitorCoords'].valueChanges
            .subscribe((selectedOptions) => {
                this.monitorCoordsSelected = selectedOptions; //contains all the selected Options
                this.monitorsChosenObjectArray = []; // keep the objects updated for later
                selectedOptions.forEach(o => {
                    let thisMC = this.monitorCoordsMulti.filter(om=>{return om.id == o;})[0];
                    this.monitorsChosenObjectArray.push({monitoring_coordination_id: thisMC.id, effort: thisMC.name});
                });
            });
        // DESCRIPTION
        projectControlGrp.controls['description'].setValue(this.modalFullProject.Description);

        // PROJECT KEYWORDS & PROJECT URLS  handled by projectPartList.component
        this.newestKeywords = this.modalProjectParts.ProjKeys;
        // ADDITIONAL_INFO
        projectControlGrp.controls['additional_info'].setValue(this.modalFullProject.AdditionalInfo);
       
        // open the modal now
        this._modalService.open(this.modalElement, {backdrop: 'static', keyboard: false, size: 'lg'} ).result.then((valid) =>{           
            let closeResult = `Closed with: ${valid}`;           
            if (valid){
                // PUT the project
                // get just Iproject entity
                let updatedProject: IProject = this.projInfoForm.controls['projectGrp'].value;
                // fix dates if present
                if (updatedProject.start_date !== null && updatedProject.start_date !== undefined)
                    updatedProject.start_date = new Date(updatedProject.start_date['year'], updatedProject.start_date['month']-1, updatedProject.start_date['day']);
                if (updatedProject.end_date !== null && updatedProject.end_date !== undefined)
                    updatedProject.end_date = new Date(updatedProject.end_date['year'], updatedProject.end_date['month']-1, updatedProject.end_date['day']);
                // apply last edited stamp to now
                updatedProject.last_edited_stamp = new Date();               
                
                // PUT the project and then update the multiselect relationship tables
                this.putProjsubscript = this._projDetService.putProject(updatedProject.project_id, updatedProject).subscribe((r: IProject) => {    
                    // KEYWORDS (remove then add all that are in new)
                    let removePromises = []; let addPromises = [];
                    this.keywordsToRemove.forEach(pkey => {
                        this.deleteProjKeysubscript = this._projDetService.deleteProjKeyword(r.project_id, pkey.keyword_id).toPromise();
                        removePromises.push(this.deleteProjKeysubscript);
                    });
                    this.newestKeywords.forEach(newKeys => {                        
                        if (newKeys.keyword_id == 0) {
                            this.postProjKeysubscript = this._projDetService.postProjKeyword(r.project_id, newKeys.term).toPromise();
                            addPromises.push(this.postProjKeysubscript);
                        }
                    });
                    // OBJECTIVES ( remove then add new ones)
                    let removedObjs = this.difference(this.originalProjObjsIDs, this.objectiveSelected);
                    removedObjs.forEach(oldObj => {
                        this.deleteProjObjsubscript = this._projDetService.deleteProjObjective(r.project_id, oldObj).toPromise();
                        removePromises.push(this.deleteProjObjsubscript);
                    });
                    let addedObjIDs = this.difference(this.objectiveSelected, this.originalProjObjsIDs);
                    addedObjIDs.forEach(newObj => {
                        this.modalProjectParts.ProjObjs = []; this.modalProjectParts.ProjObjs.push(this.objectiveMulti.filter(o => { return o.id == newObj;})[0]);
                        this.postProjObjsubscript = this._projDetService.postProjObjective(r.project_id, newObj).toPromise();
                        addPromises.push(this.postProjObjsubscript);
                    });
                    // MONITOR COORDS (remove then add new ones)
                    let removedMonCoords = this.difference(this.originalProjMonCoordIDs, this.monitorCoordsSelected);                   
                    removedMonCoords.forEach(oldMC => {
                        this.deleteProjMonsubscript = this._projDetService.deleteProjMonitorCoord(r.project_id, oldMC).toPromise();
                        removePromises.push(this.deleteProjMonsubscript);
                    });
                    let addedMonCoords = this.difference(this.monitorCoordsSelected, this.originalProjMonCoordIDs);
                    addedMonCoords.forEach(newMon => {
                        this.modalProjectParts.ProjMon = []; 
                        this.modalProjectParts.ProjMon.push(this.monitorCoordsMulti.filter(o => { return o.id == newMon;})[0]);
                        this.postProjMonsubscript = this._projDetService.postProjMonitorCoord(r.project_id, newMon).toPromise();
                        addPromises.push(this.postProjMonsubscript);
                    });
                    // clean up
                    this.keywordsToRemove = []; this.newestKeywords = [];

                    Promise.all(removePromises).then((results1) =>{
                        let something = results1;
                        Promise.all(addPromises).then((results2) =>{
                            this.modalFullProject.Name = r.name;
                            this.modalFullProject.StartDate = r.start_date;
                            this.modalFullProject.EndDate = r.end_date;
                            this.modalFullProject.status_id = r.proj_status_id;
                            this.modalFullProject.Status = r.proj_status_id !== undefined ? this.projStatusList.filter(s=> {return s.proj_status_id == r.proj_status_id;})[0].status_value : "";
                            this.modalFullProject.duration_id = r.proj_duration_id;
                            this.modalFullProject.Duration = r.proj_duration_id !== undefined ? this.projDurationList.filter(d=> {return d.proj_duration_id == r.proj_duration_id;})[0].duration_value : "";
                            this.modalFullProject.Description = r.description; this.modalFullProject.AdditionalInfo = r.additional_info; 
                            this.modalFullProject.ProjectWebsite = r.url; 
                            this.modalFullProject.last_edited_stamp = r.last_edited_stamp; this.modalFullProject.ready_flag = r.ready_flag;                            
                            this.modalFullProject.Objectives = this.objectivesChosenObjectArray;
                            this.modalFullProject.MonitoringCoords = this.monitorsChosenObjectArray;    
                            //need to store new keyword ids too after post                 
                            if (this.modalProjectParts.ProjKeys.filter(k => k.keyword_id == 0).length > 0) {
                                results2.forEach((r) => {
                                    if (Object.keys(r[0])[0] == 'keyword_id')
                                        this.modalFullProject.Keywords = r;
                                });
                            } else 
                                this.modalFullProject.Keywords = this.modalProjectParts.ProjKeys;                            
                            
                            this._projDetService.setFullProject(this.modalFullProject);
                            this._projDetService.setLastEditDate(new Date());   
                        }).catch(function(err1){
                            let errorResponse1 = err1;
                            // show toaster that it failed this._modalService.open(this.modalElement);
                            //something went wrong on adds
                        });
                        
                    }).catch(function(err2){
                        let errorResponse2 = err2;
                        this._modalService.open(this.modalElement);
                        //something went wrong on removes
                    });                    
                });                
            } else {
                //invalid. do something about it
                this._modalService.open(this.modalElement);
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
        if (e[0] == "Keyword") {
            this.aKeywordToRemove = e[1];
            this.keywordsToRemove.push(this.aKeywordToRemove);
            //store it to pass back up to delete when SAVING
         //   let keyIndex = this.modalProjectParts.ProjKeys.findIndex(x => x.keyword_id == this.aKeywordToRemove.keyword_id && x.term == this.aKeywordToRemove.term);
         //   this.modalProjectParts.ProjKeys.splice(keyIndex, 1);            
        }
        else {
            this.aURLToRemove = e[1];      
            this.urlsToRemove.push(this.aURLToRemove);
            //store it to pass back up to delete when SAVING
            let urlIndex = this.modalProjectParts.ProjUrls.findIndex(x => x == this.aURLToRemove);
            this.modalProjectParts.ProjUrls.splice(urlIndex, 1);

            let projectControlGrp = <FormArray>this.projInfoForm.controls['projectGrp'];
            projectControlGrp.controls['url'].setValue(this.modalProjectParts.ProjUrls.join("|"));      
        }
    }
    
    // compare two arrays to determine what was added and what was removed for POST/DELETE
    private difference(a1,a2): Array<number> {
        let result: Array<any> = [];
        for (var oi = 0; oi < a1.length; oi++) {
            if ((a2.map(function (o) { return o; }).indexOf(a1[oi])) === -1) {
                result.push(a1[oi]);
            }
        }        
        return result;
    }
    // response from dialog (want to delete the keyword or url)
    public AreYouSureDialogResponse(val:boolean) {
        //if they clicked Yes
        if (val) {
            //keyword or url?
            if (this.aKeywordToRemove !== undefined) {
                //delete the keyword (temporarily)
                this.keywordsToRemove.push(this.aKeywordToRemove);
                //store it to pass back up to delete when SAVING
                let keyIndex = this.modalProjectParts.ProjKeys.findIndex(x => x.keyword_id == this.aKeywordToRemove.keyword_id && x.term == this.aKeywordToRemove.term);
                this.modalProjectParts.ProjKeys.splice(keyIndex, 1);
            } else {
                //it's a url
                //delete the url (temporarily)
                this.urlsToRemove.push(this.aURLToRemove);
                //store it to pass back up to delete when SAVING
                let urlIndex = this.modalProjectParts.ProjUrls.findIndex(x => x == this.aURLToRemove);
                this.modalProjectParts.ProjUrls.splice(urlIndex, 1);

                let projectControlGrp = <FormArray>this.projInfoForm.controls['projectGrp'];
                projectControlGrp.controls['url'].setValue(this.modalProjectParts.ProjUrls.join("|"));
            }
        }
    }

 /*   ngOnDestroy() {
        // Clean sub to avoid memory leak. unsubscribe from all stuff
        this.infoModalSubscript.unsubscribe()
        this.projSubscript.unsubscribe();
        this.durSubscript.unsubscribe();
        this.statSubscript.unsubscribe();
        this.objSubscript.unsubscribe();
        this.monSubscript.unsubscribe();
        if (this.putProjsubscript) this.putProjsubscript.unsubscribe();
      //  if (this.deleteProjKeysubscript) this.deleteProjKeysubscript.unsubscribe();
      //  if (this.deleteProjObjsubscript) this.deleteProjObjsubscript.unsubscribe();
      //  if (this.postProjMonsubscript) this.postProjMonsubscript.unsubscribe();
      //  if (this.deleteProjMonsubscript) this.deleteProjMonsubscript.unsubscribe();
        this.modalElement = undefined;
        this.modalFullProject = undefined;
    } */
}