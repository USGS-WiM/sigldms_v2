import { IResource } from "app/shared/interfaces/lookups/resource.interface";
import { IMedia } from "app/shared/interfaces/lookups/media.interface";
import { IFrequency } from "app/shared/interfaces/lookups/frequency.interface";
import { IParameter } from "app/shared/interfaces/lookups/parameter.interface";

export interface IFullsite {
    SiteId: number;
    Name: string;
    latitude: number;
    longitude: number;
    State: string;
    Country: string;
    lake_type_id: number;
    Lake: string;
    Waterbody: string;
    Watershed: string;
    Description: string;
    StartDate: Date;
    EndDate: Date;
    status_type_id: number;
    Status: string;
    SamplePlatform: string;
    AdditionalInfo: string;
    url: string;
    Resources: Array<IResource>;
    Media: Array<IMedia>;
    Frequencies: Array<IFrequency>;
    Parameters: Array<IParameter>;
}