// ------------------------------------------------------------------------------
// ----- projectlist.service ----------------------------------------------------
// ------------------------------------------------------------------------------

// copyright:   2016 WiM - USGS
//
// authors:  Tonia Roddick USGS Wisconsin Internet Mapping             
//
// purpose: service to retrieve the projectlist

import { Injectable } from '@angular/core';

import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { IindexProject } from "app/shared/interfaces/projects/indexProject.interface";
import { CONFIG } from "app/shared/services/CONFIG";

@Injectable()
export class ProjectlistService {
    constructor(private _http: Http){}

    // gets resolved when coming to this route
    public getFullProject(){
     //   return PROJECTS;
         let options = new RequestOptions({headers: CONFIG.JSON_AUTH_HEADERS});
         return this._http.get(CONFIG.INDEX_PROJECT_URL, options)
            .map(p => <Array<IindexProject>>p.json())            
    }
}
