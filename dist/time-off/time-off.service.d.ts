import { Repository } from 'typeorm';
import { TimeOffRequest } from './time-off-request.entity';
import { CreateRequestDto } from './dto/create-request.dto';
import { BalanceService } from '../balance/balance.service';
import { HcmService } from '../hcm/hcm.service';
export declare class TimeOffService {
    private requestRepo;
    private balanceService;
    private hcmService;
    constructor(requestRepo: Repository<TimeOffRequest>, balanceService: BalanceService, hcmService: HcmService);
    createRequest(dto: CreateRequestDto): Promise<TimeOffRequest>;
    approveRequest(id: number): Promise<TimeOffRequest>;
    rejectRequest(id: number): Promise<TimeOffRequest>;
    cancelRequest(id: number): Promise<TimeOffRequest>;
    findOne(id: number): Promise<TimeOffRequest>;
}
