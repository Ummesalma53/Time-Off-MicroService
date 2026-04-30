import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()
export class HcmService {
  private readonly logger = new Logger(HcmService.name);
  private readonly hcmBaseUrl = 'http://localhost:3000';

  constructor(private httpService: HttpService) {}

  async getBalance(employeeId: string, locationId: string): Promise<number | null> {
    try {
      const response: AxiosResponse<any> = await firstValueFrom(
        this.httpService.get(`${this.hcmBaseUrl}/hcm/balance/${employeeId}/${locationId}`)
      );
      return response.data.balance;
    } catch (error) {
      this.logger.error('HCM getBalance failed', error.message);
      return null;
    }
  }

  async deductBalance(employeeId: string, locationId: string, days: number): Promise<boolean> {
    try {
      const response: AxiosResponse<any> = await firstValueFrom(
        this.httpService.post(`${this.hcmBaseUrl}/hcm/deduct`, {
          employeeId, locationId, days,
        })
      );
      return response.data.success === true;
    } catch (error) {
      this.logger.error('HCM deductBalance failed', error.message);
      return false;
    }
  }
}