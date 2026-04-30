import { Test, TestingModule } from '@nestjs/testing';
import { TimeOffService } from './time-off.service';
import { BalanceService } from '../balance/balance.service';
import { HcmService } from '../hcm/hcm.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TimeOffRequest, RequestStatus } from './time-off-request.entity';

describe('TimeOffService', () => {
  let service: TimeOffService;
  let hcmService: HcmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TimeOffService,
        {
          provide: getRepositoryToken(TimeOffRequest),
          useValue: {
            create: jest.fn().mockImplementation(dto => dto),
            save: jest.fn().mockImplementation(q => ({ id: 1, ...q })),
            findOne: jest.fn(),
          },
        },
        {
          provide: BalanceService,
          useValue: {
            getAvailableDays: jest.fn().mockResolvedValue(10),
            reserveDays: jest.fn(),
            upsertBalance: jest.fn(),
          },
        },
        {
          provide: HcmService,
          useValue: {
            getBalance: jest.fn().mockResolvedValue(10), // Mock HCM Endpoint
            deductBalance: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    service = module.get<TimeOffService>(TimeOffService);
    hcmService = module.get<HcmService>(HcmService);
  });

  it('createRequest: HCM balance check simulate hona chahiye', async () => {
    const dto = { employeeId: 'E1', locationId: 'L1', daysRequested: 5 };
    const result = await service.createRequest(dto as any);
    
    expect(result.status).toBe(RequestStatus.PENDING);
    expect(hcmService.getBalance).toHaveBeenCalled();
  });
});