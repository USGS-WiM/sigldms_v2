// ------------------------------------------------------------------------------
// ----- projectdetail.service --------------------------------------------------
// ------------------------------------------------------------------------------

// copyright:   2016 WiM - USGS
//
// authors:  Tonia Roddick USGS Wisconsin Internet Mapping             
//
// purpose: service responsible for retrieving project details (projectContacts, projectData, etc)

import { Injectable } from '@angular/core';

import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { CONFIG } from "app/shared/services/CONFIG";
import { IFullproject } from "app/shared/interfaces/projects/fullProject.interface";
import { Subject } from "rxjs/Subject";
import { IOrganizationresource } from "app/shared/interfaces/projects/orgresource.interface";
import { IDatahost } from "app/shared/interfaces/projects/datahost.interface";
import { IContactresource } from "app/shared/interfaces/projects/contactresource.interface";
import { IPublication } from "app/shared/interfaces/projects/publication.interface";
import { IFullsite } from "app/shared/interfaces/projects/fullSite.interface";
import { IProject } from "app/shared/interfaces/projects/project.interface";
import { IObjective } from "app/shared/interfaces/lookups/objective.interface";
import { IMonitorCoord } from "app/shared/interfaces/lookups/monitorcoord.interface";
import { IKeyword } from "app/shared/interfaces/lookups/keyword.interface";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { IOrganization, IOrganizationsystem } from "app/shared/interfaces/lookups/organization.interface";
import { IDivision } from "app/shared/interfaces/lookups/division.interface";
import { ISection } from "app/shared/interfaces/lookups/section.interface";
import { IContact } from "app/shared/interfaces/projects/contact.interface";

@Injectable()
export class ProjectdetailService {

    constructor(private _http: Http) { }

    // SUBJECTS //////////////////////////////////////
    private _fullProject: Subject<IFullproject> = new Subject<IFullproject>();
    private _projInfo: Subject<IProject> = new Subject<IProject>();
    private _projOrgs: Subject<Array<IOrganizationresource>> = new Subject<Array<IOrganizationresource>>();
    private _projDatahosts: Subject<Array<IDatahost>> = new Subject<Array<IDatahost>>();
    private _projContacts: Subject<Array<IContactresource>> = new Subject<Array<IContactresource>>();
    private _projPublications: Subject<Array<IPublication>> = new Subject<Array<IPublication>>();
    private _projSites: Subject<Array<IFullsite>> = new Subject<Array<IFullsite>>();
    private _projObjectives: Subject<Array<IObjective>> = new Subject<Array<IObjective>>();
    private _projMonCoords: Subject<Array<IMonitorCoord>> = new Subject<Array<IMonitorCoord>>();
    private _projKeywords: Subject<Array<IKeyword>> = new Subject<Array<IKeyword>>();
    private _lastEditedDate: Subject<Date> = new Subject<Date>();

    // GETTERS /////////////////////////////////////////////
    public getFullProj(): Observable<IFullproject> { return this._fullProject.asObservable(); }
    // public get projInfo(): Observable<IProject> { return this._projInfo.asObservable(); }
    public get projectObjectives(): Observable<Array<IObjective>> { return this._projObjectives.asObservable(); }
    public get projMonCoords(): Observable<Array<IMonitorCoord>> { return this._projMonCoords.asObservable(); }
    public get projKeywords(): Observable<Array<IKeyword>> { return this._projKeywords.asObservable(); }
    public get projOrganizations(): Observable<Array<IOrganizationresource>> { return this._projOrgs.asObservable(); }
    public projData(): Observable<Array<IDatahost>> { return this._projDatahosts.asObservable(); }
    public projContacts(): Observable<Array<IContactresource>> { return this._projContacts.asObservable(); }
    public projPublications(): Observable<Array<IPublication>> { return this._projPublications.asObservable(); }
    public projSites(): Observable<Array<IFullsite>> { return this._projSites.asObservable(); }
    public get lastEditDate(): Observable<Date> { return this._lastEditedDate.asObservable(); }

    // SETTERS /////////////////////////////////////////////////
    public setFullProject(fproj: IFullproject) {
        // set everything on the full project here when this gets updated?
        this._fullProject.next(fproj);
        this.setProjObjectives(fproj.Objectives);
        this.setProjMonCoords(fproj.MonitoringCoords);
        this.setProjKeywords(fproj.Keywords);
        this.setProjectOrganizations(fproj.Organizations);
        this.setProjectData(fproj.DataHosts);
        this.setProjectContacts(fproj.Contacts);
        this.setProjectPublications(fproj.Publications);
        this.setProjectSites(fproj.Sites);
    }
    //  public setProjectInfo(proj: IProject) { this._projInfo.next(proj); }
    public setProjectOrganizations(orgs: Array<IOrganizationresource>) { this._projOrgs.next(orgs); }
    public setProjectData(data: Array<IDatahost>) { this._projDatahosts.next(data); }
    public setProjectContacts(c: Array<IContactresource>) { this._projContacts.next(c); }
    public setProjectPublications(p: Array<IPublication>) { this._projPublications.next(p); }
    public setProjectSites(s: Array<IFullsite>) { this._projSites.next(s); }
    public setProjObjectives(newProjObs: Array<IObjective>) { this._projObjectives.next(newProjObs); }
    public setProjMonCoords(newProjMonCo: Array<IMonitorCoord>) { this._projMonCoords.next(newProjMonCo); }
    public setProjKeywords(newProjKeys: Array<IKeyword>) { this._projKeywords.next(newProjKeys); }
    public setLastEditDate(newEditDate: Date) { this._lastEditedDate.next(newEditDate); }


    // HTTP GET REQUESTS //////////////////////////////////////
    // get this project they clicked on from the projectlist page
    public getFullProject(id: string): Observable<IFullproject> {
        let projectParams: URLSearchParams = new URLSearchParams();
        projectParams.set('ByProject', id);

        let options = new RequestOptions({ headers: CONFIG.MIN_JSON_HEADERS, search: projectParams });
        return this._http.get(CONFIG.FULL_PROJECT_URL, options)
            .map(Presult => <IFullproject>Presult.json())
            .catch(this.handleError);
    }
    // get the project sites 
    public getProjectSites(id: string): Observable<Array<IFullsite>> {
        let options = new RequestOptions({ headers: CONFIG.MIN_JSON_HEADERS });
        return this._http.get(CONFIG.PROJECT_URL + '/' + id + '/ProjectFullSites.json', options)
            .map(Sresult => <Array<IFullsite>>Sresult.json())
            .catch(this.handleError);
    }
    // http GET request of project sites
    private getFullSites(id: string, fullProject: IFullproject): Observable<Array<IFullsite>> {
        // /projects/690/ProjectFullSites.json
        let siteOptions = new RequestOptions({ headers: CONFIG.MIN_JSON_HEADERS });
        return this._http.get(CONFIG.PROJECT_URL + '/' + id + '/ProjectFullSites', siteOptions)
            .map(siteResponse => <Array<IFullsite>>siteResponse.json())
            .catch(this.handleError);
    }
    // http get request of project objectives
    public getProjectObjectives(projId: number) {
        let options = new RequestOptions({ headers: CONFIG.MIN_JSON_HEADERS });
        this._http.get(CONFIG.PROJECT_URL + "/" + projId + "/objectives.json", options)
            .map(res => <IObjective[]>res.json())
            .subscribe(pos => { this._projObjectives.next(pos); },
            error => this.handleError);
    }
    // http get request of project monitoring coordinations
    public getProjectMonitorCoords(projId: number) {
        let options = new RequestOptions({ headers: CONFIG.MIN_JSON_HEADERS });
        this._http.get(CONFIG.PROJECT_URL + "/" + projId + "/MonitorCoordinations.json", options)
            .map(res => <IMonitorCoord[]>res.json())
            .subscribe(m => { this._projMonCoords.next(m); },
            error => this.handleError);
    }
    // http get request of project keywords
    public getProjectKeywords(projId: number) {
        let options = new RequestOptions({ headers: CONFIG.MIN_JSON_HEADERS });
        this._http.get(CONFIG.PROJECT_URL + "/" + projId + "/Keywords.json", options)
            .map(res => <IKeyword[]>res.json())
            .subscribe(k => { this._projKeywords.next(k); },
            error => this.handleError);
    }

    ///////////////////////// HTTP POST REQUESTS //////////////////////////////////////
    // post a new datahost
    public postDatahost(newDataHost: IDatahost) {
        let options = new RequestOptions({ headers: CONFIG.JSON_AUTH_HEADERS });
        return this._http.post(CONFIG.DATAHOST_URL, newDataHost, options)
            .map(res => { this._projDatahosts.next(<Array<IDatahost>>res.json()); })
            .catch(this.handleError);
    }

    // post a new publication
    public postPublication(projID: number, newPublication: IPublication) {
        let options = new RequestOptions({ headers: CONFIG.JSON_AUTH_HEADERS });
        return this._http.post(CONFIG.PROJECT_URL + "/" + projID + "/addPublication", newPublication, options)
            .map(res => { this._projPublications.next(<Array<IPublication>>res.json()); })
            .catch(this.handleError);
    }

    // post a new proj keyword
    public postProjKeyword(projID: number, term: string) {
        let keyParams: URLSearchParams = new URLSearchParams();
        keyParams.append('Word', term);

        let options = new RequestOptions({ headers: CONFIG.JSON_AUTH_HEADERS, search: keyParams });
        return this._http.post(CONFIG.PROJECT_URL + "/" + projID + "/addKeyword", null, options)
            .map(res => <Array<IKeyword>>res.json());
            //.catch(this.handleError);
    }

    // post a new proj objective type
    public postProjObjective(projID: number, objectiveId: number) {
        let objParams: URLSearchParams = new URLSearchParams();
        objParams.set('ObjectiveTypeId', objectiveId.toString());

        let options = new RequestOptions({ headers: CONFIG.JSON_AUTH_HEADERS, search: objParams });
        return this._http.post(CONFIG.PROJECT_URL + "/" + projID + "/addObjective", null, options)
            .map(res => <Array<IObjective>>res.json());
          //  .map(res => { this._projObjectives.next(<Array<IObjective>>res.json()); })
           // .catch(this.handleError);
    }

    // post new project monitor coordiation effort
    public postProjMonitorCoord(projID: number, monitorCoordId: number) {
        let monParams: URLSearchParams = new URLSearchParams();
        monParams.set('MonitorCoordId', monitorCoordId.toString());

        let options = new RequestOptions({ headers: CONFIG.JSON_AUTH_HEADERS, search: monParams });
        return this._http.post(CONFIG.PROJECT_URL + "/" + projID + "/addMonitorCoord", null, options)
            .map(res => <Array<IMonitorCoord>>res.json());
           // .map(res => { this._projMonCoords.next(<Array<IMonitorCoord>>res.json()); })
           // .catch(this.handleError);
    }

    // post new project organization
    public postProjOrganizationRes(projID: number, orgId: number, divId: number, secId: number) {
        let orgParams: URLSearchParams = new URLSearchParams();
        orgParams.set('OrganizationId', orgId.toString());
        orgParams.set('DivisionId', divId.toString());
        orgParams.set('SectionId', secId.toString());

        let options = new RequestOptions({ headers: CONFIG.JSON_AUTH_HEADERS, search: orgParams });
        return this._http.post(CONFIG.PROJECT_URL + "/" + projID + "/AddOrganization", null, options)
            .map(res => { this._projOrgs.next(<Array<IOrganizationresource>>res.json()); })
            .catch(this.handleError);
    }
    // post new organization system (org/div/sec combo)
    public postOrganizationSystem(anOrgSys: IOrganizationsystem) {
        let options = new RequestOptions({ headers: CONFIG.JSON_AUTH_HEADERS });
        return this._http.post(CONFIG.ORGANIZATIONSYSTEM_URL, anOrgSys, options)
            .map(res => <IOrganizationsystem>res.json())
            .catch(this.handleError);
    }

    //post new project contact
    public postProjContact(projID: number, newContact: IContactresource) {
        let options = new RequestOptions({ headers: CONFIG.JSON_AUTH_HEADERS });
        return this._http.post(CONFIG.PROJECT_URL + "/" + projID + "/addContact", newContact, options)
            .map(res => <Array<IContact>>res.json())
            .catch(this.handleError);
    }

    ///////////////////////// HTTP PUT REQUESTS //////////////////////////////////////
    // put a project
    public putProject(id: number, aProject: IProject) {
        let options = new RequestOptions({ headers: CONFIG.JSON_AUTH_HEADERS });
        return this._http.put(CONFIG.PROJECT_URL + '/' + id, aProject, options)
            .map(res => <IProject>res.json())
            .catch(this.handleError);
    }
    // put a datahost
    public putDatahost(id: number, aDataHost: IDatahost) {
        let options = new RequestOptions({ headers: CONFIG.JSON_AUTH_HEADERS });
        return this._http.put(CONFIG.DATAHOST_URL + '/' + id, aDataHost, options)
            .map(res => <IDatahost>res.json())
            .catch(this.handleError);
        //.subscribe(d => { this._projDatahosts[i].next(d)});            
    }

    //put publications
    public putPublication(id: number, aPublication: IPublication) {
        let options = new RequestOptions({ headers: CONFIG.JSON_AUTH_HEADERS });
        return this._http.put(CONFIG.PUBLICATION_URL + '/' + id, aPublication, options)
            .map(res => <IPublication>res.json())
            .catch(this.handleError);
    }

    // put contact
    public putContact(id: number, aContact: IContactresource){
        let options = new RequestOptions({ headers: CONFIG.JSON_AUTH_HEADERS });
        return this._http.put(CONFIG.CONTACT_URL + '/' + id, aContact, options)
            .map(res => <IContactresource>res.json())
            .catch(this.handleError);
    }
    ///////////////////////// HTTP DELETE REQUESTS //////////////////////////////////////
    // delete a datahost
    public deleteDatahost(id: number) {
        let options = new RequestOptions({ headers: CONFIG.JSON_AUTH_HEADERS });
        return this._http.delete(CONFIG.DATAHOST_URL + '/' + id, options)
            .catch(this.handleError);
    }

    // delete a project keyword
    public deleteProjKeyword(projectId: number, keywordId: number) {
        let keyParams: URLSearchParams = new URLSearchParams();
        keyParams.set('KeywordId', keywordId.toString());

        let options = new RequestOptions({ headers: CONFIG.JSON_AUTH_HEADERS });
        return this._http.delete(CONFIG.PROJECT_URL + '/' + projectId + "/removeKeyword?KeywordId=" + keywordId, options)
            .catch(this.handleError);;
    }

    // delete a project objective
    public deleteProjObjective(projectId: number, objId: number) {
        let objParams: URLSearchParams = new URLSearchParams();
        objParams.set('ObjectiveTypeId', objId.toString());

        let options = new RequestOptions({ headers: CONFIG.JSON_AUTH_HEADERS, search: objParams });
        return this._http.delete(CONFIG.PROJECT_URL + '/' + projectId + "/removeObjective", options)
            .catch(this.handleError);;
    }

    // delete project monitor coordination
    public deleteProjMonitorCoord(projectId: number, monId: number) {
        let monParams: URLSearchParams = new URLSearchParams();
        monParams.set('MonitorCoordId', monId.toString());

        let options = new RequestOptions({ headers: CONFIG.JSON_AUTH_HEADERS, search: monParams });
        return this._http.delete(CONFIG.PROJECT_URL + '/' + projectId + "/removeMonitorCoord", options)
            .catch(this.handleError);;

    }
    //delete publication
    public deletePublication(projID: number, pubID: number) {
        let pubParams: URLSearchParams = new URLSearchParams();
        pubParams.set('PublicationId', pubID.toString());

        let options = new RequestOptions({ headers: CONFIG.JSON_AUTH_HEADERS, search: pubParams });
        return this._http.delete(CONFIG.PROJECT_URL + '/' + projID + "/RemovePublication", options)
            .catch(this.handleError);
    }
    public deleteProjContact(projID: number, contactID: number) {
        let conParams: URLSearchParams = new URLSearchParams();
        conParams.set('ContactId', contactID.toString());

        let options = new RequestOptions({ headers: CONFIG.JSON_AUTH_HEADERS, search: conParams });
        return this._http.delete(CONFIG.PROJECT_URL + '/' + projID + "/removeContact", options)
            .catch(this.handleError);
    }
    //delete project org
    public deleteProjOrganizationRes(projID: number, orgSysID: number) {
        let orgSysParams: URLSearchParams = new URLSearchParams();
        orgSysParams.set('OrgSystemId', orgSysID.toString());

        let options = new RequestOptions({ headers: CONFIG.JSON_AUTH_HEADERS, search: orgSysParams });
        return this._http.delete(CONFIG.PROJECT_URL + '/' + projID + "/removeOrganization", options)
            .catch(this.handleError);;
    }

    ///////////////////////// UTILITY FUNCTIONS ////////////////////////////////////////////
    // update all the stuff
    public updateProjectParts(p: IFullproject): void {
        this.getProjectObjectives(p.ProjectId); // update the subject for those subscribers
        this.getProjectMonitorCoords(p.ProjectId); // update the subject for those subscribers
        this.getProjectKeywords(p.ProjectId); // update the subject for those subscribers        
        this.setFullProject(p);
        this.setProjectOrganizations(p.Organizations);
        this.setProjectData(p.DataHosts);
        this.setProjectContacts(p.Contacts);
        this.setProjectPublications(p.Publications);
        this.setProjectSites(p.Sites);
    }
    //convert IFullproject into IProject
    public getIprojectEntity(p: IFullproject): IProject {
        let thisProject: IProject = {
            project_id: p.ProjectId,
            name: p.Name,
            start_date: p.StartDate,
            end_date: p.EndDate,
            url: p.ProjectWebsite,
            additional_info: p.AdditionalInfo,
            data_manager_id: p.DataManagerId,
            science_base_id: p.ScienceBaseId,
            description: p.Description,
            proj_status_id: p.status_id,
            proj_duration_id: p.duration_id,
            ready_flag: p.ready_flag,
            created_stamp: p.created_stamp,
            last_edited_stamp: p.last_edited_stamp
        }
        return thisProject;
    }

    private handleError(error: any) {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg);
        return Observable.throw(errMsg);
    }

    // modal for editing project
    private _projInfoModal: BehaviorSubject<boolean> = <BehaviorSubject<boolean>>new BehaviorSubject(false);
    public setProjectInfoModal(val: any) {
        this._projInfoModal.next(val);
    }
    public get showProjectInfoModal(): any {
        return this._projInfoModal.asObservable();
    }
}
