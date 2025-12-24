export interface User {
    id: number;
    password: string;
    first_name: string;
    last_name: string;
    birth_date: Date;
    email: string;
    phone: string;
    is_active: boolean;
    role: Role;
}

export interface Role{
    id: number;
    role_name: string;
}
