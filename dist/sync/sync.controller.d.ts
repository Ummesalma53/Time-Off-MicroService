import { SyncService } from './sync.service';
export declare class SyncController {
    private readonly syncService;
    constructor(syncService: SyncService);
    batchSync(body: {
        records: {
            employeeId: string;
            locationId: string;
            totalDays: number;
        }[];
    }): Promise<{
        synced: number;
        records: import("../balance/balance.entity").Balance[];
    }>;
    realtimeSync(body: {
        employeeId: string;
        locationId: string;
        totalDays: number;
    }): Promise<import("../balance/balance.entity").Balance>;
}
