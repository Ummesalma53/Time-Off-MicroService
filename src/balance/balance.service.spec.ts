import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BalanceService } from './balance.service';
import { Balance } from './balance.entity';

describe('BalanceService', () => {
  let service: BalanceService;
  let repo: any;

  // Mock Data for Simulation
  const mockBalance = {
    employeeId: 'EMP123',
    locationId: 'LOC1',
    totalDays: 20,
    usedDays: 5,
    pendingDays: 2,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BalanceService,
        {
          provide: getRepositoryToken(Balance),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockBalance),
            save: jest.fn().mockImplementation((b) => Promise.resolve(b)),
            create: jest.fn().mockImplementation((dto) => dto),
          },
        },
      ],
    }).compile();

    service = module.get<BalanceService>(BalanceService);
    repo = module.get(getRepositoryToken(Balance));
  });

  // TEST 1: Calculation Logic
  it('available days calculate karne chahiye', async () => {
    const days = await service.getAvailableDays('EMP123', 'LOC1');
    expect(days).toEqual(13); // 20 - 5 - 2
  });

  // TEST 2: Anniversary / Upsert Logic
  it('upsertBalance: Anniversary par balance update hona chahiye', async () => {
    const updateSpy = jest.spyOn(repo, 'save');
    await service.upsertBalance('EMP123', 'LOC1', 25); // Anniversary new balance
    
    expect(mockBalance.totalDays).toBe(25);
    expect(updateSpy).toHaveBeenCalled();
  });
});