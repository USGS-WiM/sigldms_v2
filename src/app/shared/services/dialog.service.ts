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
import { Http } from '@angular/http';
import { Subject }      from 'rxjs/Subject';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { CONFIG } from "app/shared/services/CONFIG";
import { IDatamanager } from "app/shared/interfaces/settings/datamanager.interface";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

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
}