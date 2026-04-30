export declare enum RequestStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    CANCELLED = "CANCELLED"
}
export declare class TimeOffRequest {
    id: number;
    employeeId: string;
    locationId: string;
    startDate: string;
    endDate: string;
    daysRequested: number;
    status: RequestStatus;
    createdAt: Date;
    updatedAt: Date;
}
