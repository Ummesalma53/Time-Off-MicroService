import { Controller, Post, Get, Patch, Delete, Param, Body } from '@nestjs/common';
import { TimeOffService } from './time-off.service';
import { BalanceService } from '../balance/balance.service';
import { CreateRequestDto } from './dto/create-request.dto';

@Controller('time-off')
export class TimeOffController {
  constructor(
    private readonly timeOffService: TimeOffService,
    private readonly balanceService: BalanceService,
  ) {}

  @Post('request')
  create(@Body() dto: CreateRequestDto) {
    return this.timeOffService.createRequest(dto);
  }

  @Get('request/:id')
  findOne(@Param('id') id: string) {
    return this.timeOffService.findOne(+id);
  }

  @Get('balance/:employeeId/:locationId')
  getBalance(
    @Param('employeeId') employeeId: string,
    @Param('locationId') locationId: string,
  ) {
    return this.balanceService.getBalance(employeeId, locationId);
  }

  @Patch('request/:id/approve')
  approve(@Param('id') id: string) {
    return this.timeOffService.approveRequest(+id);
  }

  @Patch('request/:id/reject')
  reject(@Param('id') id: string) {
    return this.timeOffService.rejectRequest(+id);
  }

  @Delete('request/:id')
  cancel(@Param('id') id: string) {
    return this.timeOffService.cancelRequest(+id);
  }
}