import { TimeOffService } from './time-off.service';
import { BalanceService } from '../balance/balance.service';
import { CreateRequestDto } from './dto/create-request.dto';
export declare class TimeOffController {
    private readonly timeOffService;
    private readonly balanceService;
    constructor(timeOffService: TimeOffService, balanceService: BalanceService);
    create(dto: CreateRequestDto): Promise<import("./time-off-request.entity").TimeOffRequest>;
    findOne(id: string): Promise<import("./time-off-request.entity").TimeOffRequest>;
    getBalance(employeeId: string, locationId: string): Promise<import("../balance/balance.entity").Balance>;
    approve(id: string): Promise<import("./time-off-request.entity").TimeOffRequest>;
    reject(id: string): Promise<import("./time-off-request.entity").TimeOffRequest>;
    cancel(id: string): Promise<import("./time-off-request.entity").TimeOffRequest>;
}
