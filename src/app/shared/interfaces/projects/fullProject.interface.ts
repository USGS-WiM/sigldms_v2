import { IObjective } from "app/shared/interfaces/lookups/objective.interface";
import { IMonitorCoord } from "app/shared/interfaces/lookups/monitorcoord.interface";
import { IKeyword } from "app/shared/interfaces/lookups/keyword.interface";
import { IDatahost } from "app/shared/interfaces/projects/datahost.interface";
import { IOrganizationresource } from "app/shared/interfaces/projects/orgresource.interface";
import { IPublication } from "app/shared/interfaces/projects/publication.interface";
import { IContactresource } from "app/shared/interfaces/projects/contactresource.interface";
import { IFullsite } from "app/shared/interfaces/projects/fullSite.interface";

export interface IFullproject {
    ProjectId?: number;
    ScienceBaseId?: string;
    Name?: string;
    StartDate?: Date;
    EndDate?: Date;
    DataManagerId?: number;
    status_id?: number;
    Status?: string;
    duration_id?: number;
    Duration?: string;
    Description?: string;
    AdditionalInfo?: string;
    Objectives?: Array<IObjective>;
    MonitoringCoords?: Array<IMonitorCoord>;    
    Keywords?: Array<IKeyword>;
    ProjectWebsite?: string;
    DataHosts?: Array<IDatahost>;
    Organizations?: Array<IOrganizationresource>;
    Contacts?: Array<IContactresource>;
    Publications?: Array<IPublication>;
    Sites?: Array<IFullsite>
    created_stamp?: Date;
    last_edited_stamp?: Date;
    ready_flag?: number;
}