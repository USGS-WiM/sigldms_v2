export interface IDatamanager {
    data_manager_id: number;
    username: string;
    fname: string;
    lname: string;
    organization_system_id: number;
    phone: string;
    email: string;
    role_id: number;
    password: string;
    salt: string;
    reset_flag: number;   
}