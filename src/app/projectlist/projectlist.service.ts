import { Injectable } from '@angular/core';

import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { IindexProject } from "app/shared/indexProject.interface";

let PROJECTS: Array<IindexProject> = [
    {project_id: 1, data_manager_id: 1, name: "2012 Fish Sampling in Waukegan Harbor Area of Concern", lname: "Ambroz", fname: "Duane", site_count: 0, last_edited_stamp: "03/21/2017"},
    {project_id: 2, data_manager_id: 1, name: "A Survey and Characterization of Michigan's Coastal Fen Communities", lname: "Preisser", fname: "Matt", site_count:0},
    {project_id: 3, data_manager_id: 1, name: "A Survey and Characterization of Michigan's Coastal Fen Communities - Year 2", lname: "Preisser", fname: "Matt", site_count:0},
    {project_id: 4, data_manager_id: 1, name: "A Survey of Sport Fishing in the Illinois Portion of Lake Michigan", lname: "Roswell", fname: "Charles", site_count: 0},
    {project_id: 5, data_manager_id: 1, name: "A test project", lname: "Bruce", fname: "Jennifer", organization_name:"U.S. Geological Survey", site_count: 0, last_edited_stamp: "12/19/2016"},
    {project_id: 6, data_manager_id: 1, name: "Acme Township Surface Water Quality Monitoring", lname: "Henkel", fname: "Tom", site_count: 0},
    {project_id: 7, data_manager_id: 1, name: "Addressing Gaps in Understanding of Near-shore Communities in the Great Lakes", lname: "Preisser", fname: "Matt", site_count: 0},
    {project_id: 8, data_manager_id: 1, name: "Adopt-a-Beach Cleanups", lname: "Preisser", fname: "Matt", site_count: 0}
]

//let projectPromise = Promise.resolve(PROJECTS);

@Injectable()
export class ProjectlistService {
    getProjects():Array<IindexProject>{ return PROJECTS;}    
}
