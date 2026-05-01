import { Test, TestingModule } from '@nestjs/testing';
import { TimeOffService } from './time-off.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TimeOffRequest, RequestStatus } from './time-off-request.entity';
import { BalanceService } from '../balance/balance.service';
import { HcmService } from '../hcm/hcm.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const mockRequestRepo = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
};

const mockBalanceService = {
  getAvailableDays: jest.fn(),
  reserveDays: jest.fn(),
  confirmDays: jest.fn(),
  releasePendingDays: jest.fn(),
};

const mockHcmService = {
  getBalance: jest.fn(),
  deductBalance: jest.fn(),
};

const mockDto = {
  employeeId: 'emp1',
  locationId: 'loc1',
  startDate: '2025-08-01',
  endDate: '2025-08-03',
  daysRequested: 2,
};

describe('TimeOffService', () => {
  let service: TimeOffService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TimeOffService,
        {
          provide: getRepositoryToken(TimeOffRequest),
          useValue: mockRequestRepo,
        },
        { provide: BalanceService, useValue: mockBalanceService },
        { provide: HcmService, useValue: mockHcmService },
      ],
    }).compile();
    service = module.get<TimeOffService>(TimeOffService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('createRequest', () => {
    it('should create request successfully', async () => {
      mockBalanceService.getAvailableDays.mockResolvedValue(10);
      mockHcmService.getBalance.mockResolvedValue(10);
      mockHcmService.deductBalance.mockResolvedValue(true);
      mockBalanceService.reserveDays.mockResolvedValue(undefined);
      mockRequestRepo.create.mockReturnValue({
        ...mockDto, status: RequestStatus.PENDING
      });
      mockRequestRepo.save.mockResolvedValue({
        id: 1, ...mockDto, status: RequestStatus.PENDING
      });
      const result = await service.createRequest(mockDto);
      expect(result.status).toBe(RequestStatus.PENDING);
      expect(result.id).toBe(1);
    });

    it('should reject if local balance insufficient', async () => {
      mockBalanceService.getAvailableDays.mockResolvedValue(1);
      await expect(service.createRequest(mockDto))
        .rejects.toThrow(BadRequestException);
    });

    it('should reject if HCM is unavailable', async () => {
      mockBalanceService.getAvailableDays.mockResolvedValue(10);
      mockHcmService.getBalance.mockResolvedValue(null);
      await expect(service.createRequest(mockDto))
        .rejects.toThrow('HCM is unavailable');
    });

    it('should reject if HCM balance insufficient', async () => {
      mockBalanceService.getAvailableDays.mockResolvedValue(10);
      mockHcmService.getBalance.mockResolvedValue(1);
      await expect(service.createRequest(mockDto))
        .rejects.toThrow('Insufficient balance (HCM check)');
    });

    it('should reject if HCM deduction fails', async () => {
      mockBalanceService.getAvailableDays.mockResolvedValue(10);
      mockHcmService.getBalance.mockResolvedValue(10);
      mockHcmService.deductBalance.mockResolvedValue(false);
      await expect(service.createRequest(mockDto))
        .rejects.toThrow('HCM rejected the deduction');
    });
  });

  describe('approveRequest', () => {
    it('should approve pending request', async () => {
      mockRequestRepo.findOne.mockResolvedValue({
        id: 1, ...mockDto, status: RequestStatus.PENDING
      });
      mockBalanceService.confirmDays.mockResolvedValue(undefined);
      mockRequestRepo.save.mockResolvedValue({
        id: 1, ...mockDto, status: RequestStatus.APPROVED
      });
      const result = await service.approveRequest(1);
      expect(result.status).toBe(RequestStatus.APPROVED);
    });

    it('should throw if request not pending', async () => {
      mockRequestRepo.findOne.mockResolvedValue({
        id: 1, ...mockDto, status: RequestStatus.APPROVED
      });
      await expect(service.approveRequest(1))
        .rejects.toThrow(BadRequestException);
    });
  });

  describe('rejectRequest', () => {
    it('should reject pending request', async () => {
      mockRequestRepo.findOne.mockResolvedValue({
        id: 1, ...mockDto, status: RequestStatus.PENDING
      });
      mockBalanceService.releasePendingDays.mockResolvedValue(undefined);
      mockRequestRepo.save.mockResolvedValue({
        id: 1, ...mockDto, status: RequestStatus.REJECTED
      });
      const result = await service.rejectRequest(1);
      expect(result.status).toBe(RequestStatus.REJECTED);
    });

    it('should throw if request already approved', async () => {
      mockRequestRepo.findOne.mockResolvedValue({
        id: 1, ...mockDto, status: RequestStatus.APPROVED
      });
      await expect(service.rejectRequest(1))
        .rejects.toThrow(BadRequestException);
    });
  });

  describe('cancelRequest', () => {
    it('should cancel pending request and release days', async () => {
      mockRequestRepo.findOne.mockResolvedValue({
        id: 1, ...mockDto, status: RequestStatus.PENDING
      });
      mockBalanceService.releasePendingDays.mockResolvedValue(undefined);
      mockRequestRepo.save.mockResolvedValue({
        id: 1, ...mockDto, status: RequestStatus.CANCELLED
      });
      const result = await service.cancelRequest(1);
      expect(result.status).toBe(RequestStatus.CANCELLED);
      expect(mockBalanceService.releasePendingDays).toHaveBeenCalled();
    });

    it('should throw if already cancelled', async () => {
      mockRequestRepo.findOne.mockResolvedValue({
        id: 1, ...mockDto, status: RequestStatus.CANCELLED
      });
      await expect(service.cancelRequest(1))
        .rejects.toThrow(BadRequestException);
    });
  });

  describe('findOne', () => {
    it('should return request if found', async () => {
      mockRequestRepo.findOne.mockResolvedValue({
        id: 1, ...mockDto, status: RequestStatus.PENDING
      });
      const result = await service.findOne(1);
      expect(result.id).toBe(1);
    });

    it('should throw NotFoundException if not found', async () => {
      mockRequestRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne(999))
        .rejects.toThrow(NotFoundException);
    });
  });
});