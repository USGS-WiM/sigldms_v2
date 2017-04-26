// ------------------------------------------------------------------------------
// ----- lookups.service ----------------------------------------------------
// ------------------------------------------------------------------------------

// copyright:   2016 WiM - USGS
//
// authors:  Tonia Roddick USGS Wisconsin Internet Mapping             
//
// purpose: service to retrieve all the dropdowns used throughout the app

import { Injectable } from '@angular/core';

import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { CONFIG } from "app/shared/CONFIG";
import { Subject } from "rxjs/Subject";
import { IProjDuration } from "app/shared/interfaces/lookups/projduration.interface";
import { IDivision } from "app/shared/interfaces/lookups/division.interface";
import { IFrequency } from "app/shared/interfaces/lookups/frequency.interface";
import { ILake } from "app/shared/interfaces/lookups/lake.interface";
import { IMedia } from "app/shared/interfaces/lookups/media.interface";
import { IState } from "app/shared/interfaces/lookups/state.interface";
import { IMonitorCoord } from "app/shared/interfaces/lookups/monitorcoord.interface";
import { IObjective } from "app/shared/interfaces/lookups/objective.interface";
import { IOrganization } from "app/shared/interfaces/lookups/organization.interface";
import { IParameter } from "app/shared/interfaces/lookups/parameter.interface";
import { IProjStatus } from "app/shared/interfaces/lookups/projstatus.interface";
import { IResource } from "app/shared/interfaces/lookups/resource.interface";
import { ISection } from "app/shared/interfaces/lookups/section.interface";

@Injectable()
export class LookupsService {
    private _divisions: Subject<Array<IDivision>> = new Subject<Array<IDivision>>();
    public getDivisions(): Observable<Array<IDivision>> { // getter
        return this._divisions.asObservable();
    }
    private _frequencies: Subject<Array<IFrequency>> = new Subject<Array<IFrequency>>();
    public getFrequencies(): Observable<Array<IFrequency>> { // getter
        return this._frequencies.asObservable();
    }
    private _lakes: Subject<Array<ILake>> = new Subject<Array<ILake>>();
    public getLakes(): Observable<Array<ILake>> { // getter
        return this._lakes.asObservable();
    }
    private _media: Subject<Array<IMedia>> = new Subject<Array<IMedia>>();    
    public getMedia(): Observable<Array<IMedia>> { // getter
        return this._media.asObservable();
    }
    private _monCoord: Subject<Array<IMonitorCoord>> = new Subject<Array<IMonitorCoord>>();
    public getMonCoords(): Observable<Array<IMonitorCoord>> { // getter
        return this._monCoord.asObservable();
    }
    private _objectives: Subject<Array<IObjective>> = new Subject<Array<IObjective>>();
    public getObjectives(): Observable<Array<IObjective>> { // getter
        return this._objectives.asObservable();
    }
    private _orgs: Subject<Array<IOrganization>> = new Subject<Array<IOrganization>>();
    public getOrgs(): Observable<Array<IOrganization>> { // getter
        return this._orgs.asObservable();
    }
    private _params: Subject<Array<IParameter>> = new Subject<Array<IParameter>>();
    public getParameters(): Observable<Array<IParameter>> { // getter
        return this._params.asObservable();
    }
    private _projDurations: Array<IProjDuration>;
    public getProjDurations(): Array<IProjDuration> { // getter
        return this._projDurations;
    }
    private _projStats: Array<IProjStatus>;
    public getProjStatus(): Array<IProjStatus> { // getter
        return this._projStats;
    }
    private _resources: Subject<Array<IResource>> = new Subject<Array<IResource>>();
    public getResources(): Observable<Array<IResource>> { // getter
        return this._resources.asObservable();
    }
    private _sections: Subject<Array<ISection>> = new Subject<Array<ISection>>();
    public getSections(): Observable<Array<ISection>> { // getter
        return this._sections.asObservable();
    }
    private _states: Subject<Array<IState>> = new Subject<Array<IState>>();
    public getStates(): Observable<Array<IState>> { // getter
        return this._states.asObservable();
    }

    constructor(private _http: Http){}

    public getLookups(){
     
         let options = new RequestOptions({headers: CONFIG.JSON_AUTH_HEADERS});

         //divisions
         this._http.get(CONFIG.DIVISION_URL, options)
            .map(p => <Array<IDivision>>p.json())
            .subscribe(d => {
                this._divisions.next(d);
            });
        //frequencies
        this._http.get(CONFIG.FREQUENCY_URL, options)
            .map(p => <Array<IFrequency>>p.json())
            .subscribe(f => {
                this._frequencies.next(f);
            });
                        
        //lakes
        this._http.get(CONFIG.LAKES_URL, options)
            .map(p => <Array<ILake>>p.json())
            .subscribe(l => {
                this._lakes.next(l);
            });

        //media
        this._http.get(CONFIG.MEDIA_URL, options)
            .map(p => <Array<IMedia>>p.json())
            .subscribe(m => {
                this._media.next(m);
            });

        //monitoring coordination
        this._http.get(CONFIG.MONITOR_EFFORTS_URL, options)
            .map(p => <Array<IMonitorCoord>>p.json())
            .subscribe(mc => {
                this._monCoord.next(mc);
            });
        
        //objectives
        this._http.get(CONFIG.OBJECTIVE_URL, options)
            .map(p => <Array<IObjective>>p.json())
            .subscribe(o => {
                this._objectives.next(o);
            });
        //organizations
        this._http.get(CONFIG.ORGANIZATION_URL, options)
            .map(p => <Array<IOrganization>>p.json())
            .subscribe(org => {
                this._orgs.next(org);
            });
        //parameters
        this._http.get(CONFIG.PARAMETERS_URL, options)
            .map(p => <Array<IParameter>>p.json())
            .subscribe(p => {
                this._params.next(p);
            });        
        //project durations
        this._http.get(CONFIG.PROJ_DURATIONS_URL, options)
            .map(res => <IProjDuration[]>res.json())
            .subscribe(s => {
                this._projDurations = s;
            });
        //project status
        this._http.get(CONFIG.PROJ_STATUS_URL, options)
            .map(p => <Array<IProjStatus>>p.json())
            .subscribe(ps => {
                this._projStats = ps;
            });        
        //resources
        this._http.get(CONFIG.RESOURCES_URL, options)
            .map(p => <Array<IResource>>p.json())
            .subscribe(r => {
                this._resources.next(r);
            });
        //sections
        this._http.get(CONFIG.SECTION_URL, options)
            .map(p => <Array<ISection>>p.json())
            .subscribe(sect => {
                this._sections.next(sect);
            });
        //states
        this._http.get(CONFIG.STATES_URL, options)
            .map(p => <Array<IState>>p.json())
            .subscribe(stat => {
                this._states.next(stat);
            });
    }
}
