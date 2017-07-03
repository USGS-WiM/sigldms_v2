// ------------------------------------------------------------------------------
// ----- auth.service -----------------------------------------------------------
// ------------------------------------------------------------------------------

// copyright:   2016 WiM - USGS
//
// authors:  Tonia Roddick USGS Wisconsin Internet Mapping             
//
// purpose: store and retrieve loggedIn properties service (global)

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Subject }      from 'rxjs/Subject';
import { CONFIG } from "app/shared/services/CONFIG";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


import { IDatamanager } from "app/shared/interfaces/settings/datamanager.interface";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { IOrganization } from "app/shared/interfaces/lookups/organization.interface";
import { IDivision } from "app/shared/interfaces/lookups/division.interface";
import { ISection } from "app/shared/interfaces/lookups/section.interface";

@Injectable()
export class DialogService {
    public redirectUrl: string; // store the URL so we can redirect after logging in
 
    constructor(private _http: Http, public _router: Router ) {
        console.log("'build dialog service instance ...");
    }

    // show/hide modal for dataHost and Publication
    private _showHideAtLeast1Modal: Subject<boolean> = new Subject<boolean>();
    public setAtLeast1Modal(val:any){
        this._showHideAtLeast1Modal.next(val);
    }
    //show the filter modal in the mainview
    public get showAtLeast1Modal():any{
        return this._showHideAtLeast1Modal.asObservable();
    }

    // show/hide modal for organizations
    private _showOrganizationModal: Subject<boolean> = new Subject<boolean>();
    public setOrganizationModal(val:any){
        this._showOrganizationModal.next(val);
    }
    //show the filter modal in the mainview
    public get showOrganizationModal():any{
        return this._showHideAtLeast1Modal.asObservable();
    }
    
    // post organization created in modal
    public postOrganization(newOrg: IOrganization) {
        let options = new RequestOptions({ headers: CONFIG.JSON_AUTH_HEADERS });
        return this._http.post(CONFIG.ORGANIZATION_URL, newOrg, options)
            .map(res=> <IOrganization>res.json())
            .catch(this.handleError);
    }
    // post division created in modal
    public postDivision(newDiv: IDivision) {
        let options = new RequestOptions({ headers: CONFIG.JSON_AUTH_HEADERS });
        return this._http.post(CONFIG.DIVISION_URL, newDiv, options)
            .map(res=> <IDivision>res.json())
            .catch(this.handleError);
    }
    // post section created in modal
    public postSection(newSec: ISection) {
        let options = new RequestOptions({ headers: CONFIG.JSON_AUTH_HEADERS });
        return this._http.post(CONFIG.SECTION_URL, newSec, options)
            .map(res=> <ISection>res.json())
            .catch(this.handleError);
    }
    private _nextUrl: Subject<any> = new Subject<any>();
    public setNextUrl(val:any){
        this._nextUrl.next(val);
    }
    public get nextUrl():any {
        return this._nextUrl.asObservable();
    }
    private _modalMessage: Subject<string> = new Subject<string>();
    public setMessage(val:string){
        this._modalMessage.next(val);
    }
    public get MessageToShow():any {
        return this._modalMessage.asObservable();
    }

     private handleError(error: any) {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg);
        return Observable.throw(errMsg);
    }
}