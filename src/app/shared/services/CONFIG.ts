import {Injectable} from "@angular/core";
import {Headers}    from "@angular/http";

@Injectable()
export class CONFIG {
    private static baseURL: string = "https://sigldev.wim.usgs.gov/SiGLServices/"; 

    // login
    public static get LOGIN_URL(): string { return this.baseURL + "login";};

    // indexProjects ?id=dataManagerId
    public static get INDEXPROJ_URL(): string { return this.baseURL + "projects/IndexProjects"};

    // allProjects, aProject, and all projectParts 
    // :id/objectives, /MonitorCoordinations, /keywords, /OrganizationResources, /datahosts, /contacts, /publications, /ProjectFullSites
    public static get PROJECT_URL(): string { return this.baseURL + "Projects"};
    public static get INDEX_PROJECT_URL(): string { return this.baseURL + "Projects/IndexProjects"};
    public static get FULL_PROJECT_URL(): string { return this.baseURL + "Projects/GetFullProject"};

    // lookups
    public static get PROJ_DURATIONS_URL(): string { return this.baseURL + "ProjectDuration"; };
    public static get PROJ_STATUS_URL(): string { return this.baseURL + "ProjectStatus"; };
    public static get ORGANIZATION_URL(): string { return this.baseURL + "organizations"; };    
    public static get DIVISION_URL(): string { return this.baseURL + "divisions"; };
    public static get SECTION_URL(): string { return this.baseURL + "sections"; };
    public static get OBJECTIVE_URL(): string {return this.baseURL + "objectives";};
    public static get MONITOR_EFFORTS_URL(): string { return this.baseURL + "MonitorCoordinations"; };
    public static get LAKES_URL(): string { return this.baseURL + "Lakes"; };
    public static get STATUS_URL(): string { return this.baseURL + "status"; };
    public static get RESOURCES_URL(): string { return this.baseURL + "ResourceTypes"; };
    public static get MEDIA_URL(): string { return this.baseURL + "Media"; };
    public static get FREQUENCY_URL(): string { return this.baseURL + "frequencies"; };
    public static get PARAMETERS_URL(): string { return this.baseURL + "Parameters"; };    
    public static get STATES_URL(): string { return this.baseURL + "sites/StatesWithSites"; };
    
    // project parts (post/put)
    public static get DATAHOST_URL(): string { return this.baseURL + "DataHosts"; };
    public static get PUBLICATION_URL(): string {return this.baseURL + "Publications"; };
    // headers
    public static get MIN_JSON_HEADERS() { return new Headers({ "Accept": "application/json" }); };
    public static get JSON_HEADERS() { return new Headers({ "Accept": "application/json", "Content-Type": "application/json" }); };
    public static get JSON_AUTH_HEADERS() { return new Headers({"Accept": "application/json", "Content-Type": "application/json", "Authorization": localStorage.getItem("creds")}); };

}