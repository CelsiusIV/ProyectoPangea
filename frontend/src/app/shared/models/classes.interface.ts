export interface Classes {
    id: number;
    beginDate: Date;
    endDate: Date;
    maxStudents: number;
    class_type: ClassType;
}

export interface ClassType {
    id: number;
    className: string;
    classLimit: number;
    price: number;
    is_available: boolean;
}

export interface Payments {
    id: number;
    class_type: ClassType;
    user_id: number;
    availableClasses: number;
    paymentDate: Date;

}