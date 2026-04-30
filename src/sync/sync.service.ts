import { Injectable } from '@nestjs/common';
import { BalanceService } from '../balance/balance.service';
import { Balance } from '../balance/balance.entity';

@Injectable()
export class SyncService {
  constructor(private balanceService: BalanceService) {}

  async batchSync(records: { employeeId: string; locationId: string; totalDays: number }[]) {
    const results: Balance[] = [];
    for (const record of records) {
      const updated = await this.balanceService.upsertBalance(
        record.employeeId,
        record.locationId,
        record.totalDays,
      );
      results.push(updated);
    }
    return { synced: results.length, records: results };
  }

  async realtimeSync(employeeId: string, locationId: string, totalDays: number) {
    return this.balanceService.upsertBalance(employeeId, locationId, totalDays);
  }
}