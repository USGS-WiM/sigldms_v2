// ------------------------------------------------------------------------------
// ----- candeactivate-guard.service -----------------------------------------------------
// ------------------------------------------------------------------------------

// copyright:   2016 WiM - USGS
//
// authors:  Tonia Roddick USGS Wisconsin Internet Mapping             
//
// purpose: checks projectdetail parts to see if any changes were unsaved before leaving route

import { Injectable }    from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable }    from 'rxjs/Observable';

export interface CanComponentDeactivate {
 canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {
  canDeactivate(component: CanComponentDeactivate) {
      let from = component["componentName"]; let what = component.canDeactivate ? component.canDeactivate() : true;
      console.log('Candeactivate: ' + from + ' : ' + what);

      return component.canDeactivate ? component.canDeactivate() : true;
  }
}
