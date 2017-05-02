// ------------------------------------------------------------------------------
// ----- candeactivate-guard.service -----------------------------------------------------
// ------------------------------------------------------------------------------

// copyright:   2016 WiM - USGS
//
// authors:  Tonia Roddick USGS Wisconsin Internet Mapping             
//
// purpose: checks projectdetail parts to see if any changes were unsaved before leaving route

import { Injectable }    from '@angular/core';
import { CanDeactivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { DialogService } from "app/shared/services/dialog.service";

export interface CanComponentDeactivate {
 canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {
  constructor(public _dialogService: DialogService ) {}
  canDeactivate( component: CanComponentDeactivate, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot){
//  canDeactivate(component: CanComponentDeactivate, route: ActivatedRouteSnapshot,
  //              state: RouterStateSnapshot) {
      //let from = component["componentName"]; 
      //let what = component.canDeactivate ? component.canDeactivate() : true;
      //console.log('Candeactivate: ' + from + ' : ' + what);
    //console.log(route.params);
    //console.log(state.url);
    this._dialogService.setNextUrl(nextState.url);
 //   component.canDeactivate();
//    return false;
    return component.canDeactivate ? component.canDeactivate() : true;
  }
}
