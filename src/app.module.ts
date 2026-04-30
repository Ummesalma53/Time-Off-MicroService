import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeOffModule } from './time-off/time-off.module';
import {BalanceModule} from './balance/balance.module';
import {HcmModule} from './hcm/hcm.module';
import {SyncModule} from './sync/sync.module';
import {Balance} from './balance/balance.entity';
import {TimeOffRequest} from './time-off/time-off-request.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type:'better-sqlite3',
      database:'timeoff.db',
      entities:[Balance,TimeOffRequest],
      synchronize:true,
    }),
    TimeOffModule,
    BalanceModule,
    HcmModule,
    SyncModule,
  ],
})
export class AppModule {}
