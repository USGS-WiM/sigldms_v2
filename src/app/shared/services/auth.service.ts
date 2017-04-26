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
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Subject }      from 'rxjs/Subject';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { CONFIG } from "app/shared/CONFIG";
import { IDatamanager } from "app/shared/interfaces/settings/datamanager.interface";
import { Router } from "@angular/router";

@Injectable()
export class AuthService {
  public redirectUrl: string; // store the URL so we can redirect after logging in
 
  constructor(private _http: Http, public _router: Router ) {}
  
  // store loggedIn parts (loggedInRole, loggedInName, loggedInUserName, loggedInID)
  private _loggedInRole: Subject<string> = new Subject<string>();
  public loggedInRole(): Observable<string> { // getter (loggedInRole)    
    return this._loggedInRole.asObservable();
  }
  private _loggedInName: Subject<string> = new Subject<string>();
  public loggedInName(): Observable<string> { // getter (loggedInName)
    return this._loggedInName.asObservable();
  }
  private _loggedInUserName: Subject<string> = new Subject<string>();
  public loggedInUserName(): Observable<string> { // getter (loggedInName)
    return this._loggedInUserName.asObservable();
  }
  private _loggedInID: Subject<number> = new Subject<number>();
  public loggedInID(): Observable<number> { // getter (loggedInName)
    return this._loggedInID.asObservable();
  } 
  
  //store the info to be retrieved in other components
  public storeUserInfo(user: IDatamanager ): void {
    //store in localStorage and in .next for subscriptions on change
    localStorage.setItem('loggedInRole', this.getLoggedInRole(user.role_id));    
    localStorage.setItem('loggedInName', user.fname + " " + user.lname);
    localStorage.setItem('loggedInUserName', user.username);
    localStorage.setItem('loggedInID', user.data_manager_id.toString());

    this._loggedInRole.next(this.getLoggedInRole(user.role_id));
    this._loggedInName.next(user.fname + " " + user.lname);
    this._loggedInUserName.next(user.username);
    this._loggedInID.next(user.data_manager_id);
    this.setStorageExpiration();
  }
  //logged out, clear the data
  public removeUserInfo(): void {    
    localStorage.clear();
    this._router.navigate(['/login']);
  }
  // make sure to clear localStorage after 24 hrs (use this when setting creds)  
  private setStorageExpiration(): void {
    let hours: number = 24; // Reset when storage is more than 24hours
    let now: number = new Date().getTime();
    let setupTime: number = Number(localStorage.getItem('setupTime'));
    if (setupTime == 0) {
      localStorage.setItem('setupTime', now.toString())
    } else {
      if(setupTime > hours*60*60*1000) {
        //localStorage.clear()
        localStorage.setItem('setupTime', now.toString());
      }
    }
  }
  // get the loggedIn Role
  private getLoggedInRole(roleId: number): string {
    switch(roleId){
      case 1: 
        return 'ADMIN';      
      case 2:
        return 'MANAGER';
      default:
        return 'PUBLIC';
    }
  }
} // end AuthService