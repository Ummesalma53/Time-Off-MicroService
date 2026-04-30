import { Module } from '@nestjs/common';
import { SyncService } from './sync.service';
import { SyncController } from './sync.controller';
import { BalanceModule } from '../balance/balance.module';

@Module({
  imports: [BalanceModule],
  providers: [SyncService],
  controllers: [SyncController],
})
export class SyncModule {}