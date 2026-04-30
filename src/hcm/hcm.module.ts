import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { HcmService } from './hcm.service';
import { HcmMockController } from './hcm-mock.controller';

@Module({
  imports: [HttpModule],
  providers: [HcmService],
  controllers: [HcmMockController],
  exports: [HcmService],
})
export class HcmModule {}