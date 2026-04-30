import { BalanceService } from '../balance/balance.service';
import { Balance } from '../balance/balance.entity';
export declare class SyncService {
    private balanceService;
    constructor(balanceService: BalanceService);
    batchSync(records: {
        employeeId: string;
        locationId: string;
        totalDays: number;
    }[]): Promise<{
        synced: number;
        records: Balance[];
    }>;
    realtimeSync(employeeId: string, locationId: string, totalDays: number): Promise<Balance>;
}
