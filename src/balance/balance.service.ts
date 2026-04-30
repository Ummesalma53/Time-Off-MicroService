import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Balance } from './balance.entity';

@Injectable()
export class BalanceService {
  constructor(
    @InjectRepository(Balance)
    private balanceRepo: Repository<Balance>,
  ) {}

  async getBalance(employeeId: string, locationId: string): Promise<Balance> {
    const balance = await this.balanceRepo.findOne({
      where: { employeeId, locationId },
    });
    if (!balance) throw new NotFoundException('Balance not found');
    return balance;
  }

  async getAvailableDays(employeeId: string, locationId: string): Promise<number> {
    const balance = await this.getBalance(employeeId, locationId);
    return balance.totalDays - balance.usedDays - balance.pendingDays;
  }

  async reserveDays(employeeId: string, locationId: string, days: number): Promise<void> {
    const balance = await this.getBalance(employeeId, locationId);
    const available = balance.totalDays - balance.usedDays - balance.pendingDays;
    if (available < days) throw new Error('Insufficient balance');
    balance.pendingDays += days;
    await this.balanceRepo.save(balance);
  }

  async confirmDays(employeeId: string, locationId: string, days: number): Promise<void> {
    const balance = await this.getBalance(employeeId, locationId);
    balance.pendingDays -= days;
    balance.usedDays += days;
    await this.balanceRepo.save(balance);
  }

  async releasePendingDays(employeeId: string, locationId: string, days: number): Promise<void> {
    const balance = await this.getBalance(employeeId, locationId);
    balance.pendingDays = Math.max(0, balance.pendingDays - days);
    await this.balanceRepo.save(balance);
  }

  async upsertBalance(employeeId: string, locationId: string, totalDays: number): Promise<Balance> {
    let balance = await this.balanceRepo.findOne({ where: { employeeId, locationId } });
    if (!balance) {
      balance = this.balanceRepo.create({ employeeId, locationId, totalDays });
    } else {
      balance.totalDays = totalDays;
    }
    return this.balanceRepo.save(balance);
  }
}