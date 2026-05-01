import { Test, TestingModule } from '@nestjs/testing';
import { BalanceService } from './balance.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Balance } from './balance.entity';
import { NotFoundException } from '@nestjs/common';

const mockBalance = {
  id: 1,
  employeeId: 'emp1',
  locationId: 'loc1',
  totalDays: 10,
  usedDays: 0,
  pendingDays: 0,
};

const mockRepo = {
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
};

describe('BalanceService', () => {
  let service: BalanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BalanceService,
        {
          provide: getRepositoryToken(Balance),
          useValue: mockRepo,
        },
      ],
    }).compile();
    service = module.get<BalanceService>(BalanceService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('getBalance', () => {
    it('should return balance if found', async () => {
      mockRepo.findOne.mockResolvedValue({ ...mockBalance });
      const result = await service.getBalance('emp1', 'loc1');
      expect(result.employeeId).toBe('emp1');
      expect(result.totalDays).toBe(10);
    });

    it('should throw NotFoundException if not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.getBalance('emp1', 'loc1'))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('getAvailableDays', () => {
    it('should return correct available days', async () => {
      mockRepo.findOne.mockResolvedValue({ ...mockBalance });
      const days = await service.getAvailableDays('emp1', 'loc1');
      expect(days).toBe(10);
    });

    it('should subtract pending and used days', async () => {
      mockRepo.findOne.mockResolvedValue({
        ...mockBalance, usedDays: 2, pendingDays: 3
      });
      const days = await service.getAvailableDays('emp1', 'loc1');
      expect(days).toBe(5);
    });
  });

  describe('reserveDays', () => {
    it('should reserve days successfully', async () => {
      mockRepo.findOne.mockResolvedValue({ ...mockBalance });
      mockRepo.save.mockResolvedValue({});
      await service.reserveDays('emp1', 'loc1', 3);
      expect(mockRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ pendingDays: 3 })
      );
    });

    it('should throw error if not enough balance', async () => {
      mockRepo.findOne.mockResolvedValue({ ...mockBalance });
      await expect(service.reserveDays('emp1', 'loc1', 15))
        .rejects.toThrow('Insufficient balance');
    });

    it('should throw error if balance is exactly 0', async () => {
      mockRepo.findOne.mockResolvedValue({
        ...mockBalance, totalDays: 5, usedDays: 5
      });
      await expect(service.reserveDays('emp1', 'loc1', 1))
        .rejects.toThrow('Insufficient balance');
    });
  });

  describe('confirmDays', () => {
    it('should move days from pending to used', async () => {
      mockRepo.findOne.mockResolvedValue({
        ...mockBalance, pendingDays: 3
      });
      mockRepo.save.mockResolvedValue({});
      await service.confirmDays('emp1', 'loc1', 3);
      expect(mockRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ usedDays: 3, pendingDays: 0 })
      );
    });
  });

  describe('releasePendingDays', () => {
    it('should release pending days back', async () => {
      mockRepo.findOne.mockResolvedValue({
        ...mockBalance, pendingDays: 5
      });
      mockRepo.save.mockResolvedValue({});
      await service.releasePendingDays('emp1', 'loc1', 3);
      expect(mockRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ pendingDays: 2 })
      );
    });

    it('should not go below 0 pending days', async () => {
      mockRepo.findOne.mockResolvedValue({
        ...mockBalance, pendingDays: 1
      });
      mockRepo.save.mockResolvedValue({});
      await service.releasePendingDays('emp1', 'loc1', 5);
      expect(mockRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ pendingDays: 0 })
      );
    });
  });

  describe('upsertBalance', () => {
    it('should create new balance if not exists', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      mockRepo.create.mockReturnValue({
        employeeId: 'emp1', locationId: 'loc1', totalDays: 10
      });
      mockRepo.save.mockResolvedValue({ id: 1 });
      await service.upsertBalance('emp1', 'loc1', 10);
      expect(mockRepo.create).toHaveBeenCalled();
      expect(mockRepo.save).toHaveBeenCalled();
    });

    it('should update existing balance', async () => {
      mockRepo.findOne.mockResolvedValue({ ...mockBalance });
      mockRepo.save.mockResolvedValue({ ...mockBalance, totalDays: 20 });
      await service.upsertBalance('emp1', 'loc1', 20);
      expect(mockRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ totalDays: 20 })
      );
    });
  });
});