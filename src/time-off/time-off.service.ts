import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TimeOffRequest, RequestStatus } from './time-off-request.entity';
import { CreateRequestDto } from './dto/create-request.dto';
import { BalanceService } from '../balance/balance.service';
import { HcmService } from '../hcm/hcm.service';

@Injectable()
export class TimeOffService {
  constructor(
    @InjectRepository(TimeOffRequest)
    private requestRepo: Repository<TimeOffRequest>,
    private balanceService: BalanceService,
    private hcmService: HcmService,
  ) {}

  async createRequest(dto: CreateRequestDto): Promise<TimeOffRequest> {
    const localAvailable = await this.balanceService.getAvailableDays(dto.employeeId, dto.locationId);
    if (localAvailable < dto.daysRequested) {
      throw new BadRequestException('Insufficient balance (local check)');
    }
    const hcmBalance = await this.hcmService.getBalance(dto.employeeId, dto.locationId);
    if (hcmBalance === null) {
      throw new BadRequestException('HCM is unavailable. Please try again later.');
    }
    if (hcmBalance < dto.daysRequested) {
      throw new BadRequestException('Insufficient balance (HCM check)');
    }
    const deducted = await this.hcmService.deductBalance(dto.employeeId, dto.locationId, dto.daysRequested);
    if (!deducted) {
      throw new BadRequestException('HCM rejected the deduction');
    }
    await this.balanceService.reserveDays(dto.employeeId, dto.locationId, dto.daysRequested);
    const request = this.requestRepo.create({ ...dto, status: RequestStatus.PENDING });
    return this.requestRepo.save(request);
  }

  async approveRequest(id: number): Promise<TimeOffRequest> {
    const request = await this.findOne(id);
    if (request.status !== RequestStatus.PENDING) {
      throw new BadRequestException('Only PENDING requests can be approved');
    }
    await this.balanceService.confirmDays(request.employeeId, request.locationId, request.daysRequested);
    request.status = RequestStatus.APPROVED;
    return this.requestRepo.save(request);
  }

  async rejectRequest(id: number): Promise<TimeOffRequest> {
    const request = await this.findOne(id);
    if (request.status !== RequestStatus.PENDING) {
      throw new BadRequestException('Only PENDING requests can be rejected');
    }
    await this.balanceService.releasePendingDays(request.employeeId, request.locationId, request.daysRequested);
    request.status = RequestStatus.REJECTED;
    return this.requestRepo.save(request);
  }

  async cancelRequest(id: number): Promise<TimeOffRequest> {
    const request = await this.findOne(id);
    if (request.status === RequestStatus.CANCELLED) {
      throw new BadRequestException('Already cancelled');
    }
    if (request.status === RequestStatus.PENDING) {
      await this.balanceService.releasePendingDays(request.employeeId, request.locationId, request.daysRequested);
    }
    request.status = RequestStatus.CANCELLED;
    return this.requestRepo.save(request);
  }

  async findOne(id: number): Promise<TimeOffRequest> {
    const request = await this.requestRepo.findOne({ where: { id } });
    if (!request) throw new NotFoundException(`Request ${id} not found`);
    return request;
  }
}