"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var HcmService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HcmService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
let HcmService = HcmService_1 = class HcmService {
    httpService;
    logger = new common_1.Logger(HcmService_1.name);
    hcmBaseUrl = 'http://localhost:3000';
    constructor(httpService) {
        this.httpService = httpService;
    }
    async getBalance(employeeId, locationId) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${this.hcmBaseUrl}/hcm/balance/${employeeId}/${locationId}`));
            return response.data.balance;
        }
        catch (error) {
            this.logger.error('HCM getBalance failed', error.message);
            return null;
        }
    }
    async deductBalance(employeeId, locationId, days) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.hcmBaseUrl}/hcm/deduct`, {
                employeeId, locationId, days,
            }));
            return response.data.success === true;
        }
        catch (error) {
            this.logger.error('HCM deductBalance failed', error.message);
            return false;
        }
    }
};
exports.HcmService = HcmService;
exports.HcmService = HcmService = HcmService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], HcmService);
//# sourceMappingURL=hcm.service.js.map