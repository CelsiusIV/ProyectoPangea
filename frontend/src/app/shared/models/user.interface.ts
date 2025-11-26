export interface User {
    id: number;
    username: string;
    password: string;
    first_name: string;
    last_name: string;
    birth_date: Date;
    email: string;
    phone: number;
    is_active: boolean;
    role: Role;
}

export interface Role{
    id: number;
    rolename: string;
}
