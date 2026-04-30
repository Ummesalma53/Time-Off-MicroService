import { Controller, Post, Body } from '@nestjs/common';
import { SyncService } from './sync.service';

@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Post('batch')
  batchSync(@Body() body: { records: { employeeId: string; locationId: string; totalDays: number }[] }) {
    return this.syncService.batchSync(body.records);
  }

  @Post('realtime')
  realtimeSync(@Body() body: { employeeId: string; locationId: string; totalDays: number }) {
    return this.syncService.realtimeSync(body.employeeId, body.locationId, body.totalDays);
  }
}