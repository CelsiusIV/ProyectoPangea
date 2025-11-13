export interface User {
    id: number;
    username: string;
    password: string;
    name: string;
    lastname?: string;
    birthyear?: number;
    email: string;
    phone: number;
    is_active: boolean;
    role: Role;
}

export interface Role{
    id: number;
    rolename: string;
}
