import { HttpService } from '@nestjs/axios';
export declare class HcmService {
    private httpService;
    private readonly logger;
    private readonly hcmBaseUrl;
    constructor(httpService: HttpService);
    getBalance(employeeId: string, locationId: string): Promise<number | null>;
    deductBalance(employeeId: string, locationId: string, days: number): Promise<boolean>;
}
