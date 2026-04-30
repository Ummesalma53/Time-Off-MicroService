import { Repository } from 'typeorm';
import { Balance } from './balance.entity';
export declare class BalanceService {
    private balanceRepo;
    constructor(balanceRepo: Repository<Balance>);
    getBalance(employeeId: string, locationId: string): Promise<Balance>;
    getAvailableDays(employeeId: string, locationId: string): Promise<number>;
    reserveDays(employeeId: string, locationId: string, days: number): Promise<void>;
    confirmDays(employeeId: string, locationId: string, days: number): Promise<void>;
    releasePendingDays(employeeId: string, locationId: string, days: number): Promise<void>;
    upsertBalance(employeeId: string, locationId: string, totalDays: number): Promise<Balance>;
}
