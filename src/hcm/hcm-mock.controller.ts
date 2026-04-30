import { Controller, Get, Post, Param, Body } from '@nestjs/common';

const mockBalances: Record<string, number> = {
  'emp1_loc1': 10,
  'emp2_loc1': 5,
};

@Controller('hcm')
export class HcmMockController {
  @Get('balance/:employeeId/:locationId')
  getBalance(
    @Param('employeeId') employeeId: string,
    @Param('locationId') locationId: string,
  ) {
    const key = `${employeeId}_${locationId}`;
    const balance = mockBalances[key] ?? 0;
    return { employeeId, locationId, balance };
  }

  @Post('deduct')
  deductBalance(@Body() body: { employeeId: string; locationId: string; days: number }) {
    const key = `${body.employeeId}_${body.locationId}`;
    if (mockBalances[key] === undefined) return { success: false, error: 'Invalid employee/location' };
    if (mockBalances[key] < body.days) return { success: false, error: 'Insufficient balance' };
    mockBalances[key] -= body.days;
    return { success: true, remaining: mockBalances[key] };
  }

  @Post('anniversary-bonus')
  anniversaryBonus(@Body() body: { employeeId: string; locationId: string; bonus: number }) {
    const key = `${body.employeeId}_${body.locationId}`;
    if (!mockBalances[key]) mockBalances[key] = 0;
    mockBalances[key] += body.bonus;
    return { success: true, newBalance: mockBalances[key] };
  }
}