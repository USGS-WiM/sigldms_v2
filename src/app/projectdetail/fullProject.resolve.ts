// ------------------------------------------------------------------------------
// ----- projectdetail.resolve --------------------------------------------------
// ------------------------------------------------------------------------------

// copyright:   2016 WiM - USGS//
// authors:  Tonia Roddick USGS Wisconsin Internet Mapping
// purpose: resolver to get the FullProject when route is navigated to

import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { IFullproject } from "app/shared/interfaces/projects/fullProject.interface";
import { ProjectdetailService } from "app/projectdetail/projectdetail.service";
import { Observable } from "rxjs/Observable";

@Injectable()
export class FullProjectResolve implements Resolve<IFullproject> {

  constructor(private _projDetService: ProjectdetailService) {}

  // this resolver is not working. I don't know if its the service or the resolver, but the subscribe is returning nothing even though service
  //is getting the full project properly. either keep digging or remove resolver...
  resolve(route: ActivatedRouteSnapshot): Observable<IFullproject> {
     let id = route.params['id'];
     if (id > 0) return this._projDetService.getFullProject(id);     
  }
}