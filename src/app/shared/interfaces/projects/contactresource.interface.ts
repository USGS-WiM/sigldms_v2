import { IOrganizationresource } from "app/shared/interfaces/projects/orgresource.interface";

export interface IContactresource {
    contact_id?: number;
    science_base_id?: string;
    name: string;
    email: string;
    phone: string;
    organization_system_id?: number;
    org_id: number;
    ContactOrgName?: string;
    div_id?: number;
    ContactDivName?: string;
    ContactSecName?: string;
    sec_id?: number;
    isEditing?: boolean;
}