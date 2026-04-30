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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeOffService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const time_off_request_entity_1 = require("./time-off-request.entity");
const balance_service_1 = require("../balance/balance.service");
const hcm_service_1 = require("../hcm/hcm.service");
let TimeOffService = class TimeOffService {
    requestRepo;
    balanceService;
    hcmService;
    constructor(requestRepo, balanceService, hcmService) {
        this.requestRepo = requestRepo;
        this.balanceService = balanceService;
        this.hcmService = hcmService;
    }
    async createRequest(dto) {
        const localAvailable = await this.balanceService.getAvailableDays(dto.employeeId, dto.locationId);
        if (localAvailable < dto.daysRequested) {
            throw new common_1.BadRequestException('Insufficient balance (local check)');
        }
        const hcmBalance = await this.hcmService.getBalance(dto.employeeId, dto.locationId);
        if (hcmBalance === null) {
            throw new common_1.BadRequestException('HCM is unavailable. Please try again later.');
        }
        if (hcmBalance < dto.daysRequested) {
            throw new common_1.BadRequestException('Insufficient balance (HCM check)');
        }
        const deducted = await this.hcmService.deductBalance(dto.employeeId, dto.locationId, dto.daysRequested);
        if (!deducted) {
            throw new common_1.BadRequestException('HCM rejected the deduction');
        }
        await this.balanceService.reserveDays(dto.employeeId, dto.locationId, dto.daysRequested);
        const request = this.requestRepo.create({ ...dto, status: time_off_request_entity_1.RequestStatus.PENDING });
        return this.requestRepo.save(request);
    }
    async approveRequest(id) {
        const request = await this.findOne(id);
        if (request.status !== time_off_request_entity_1.RequestStatus.PENDING) {
            throw new common_1.BadRequestException('Only PENDING requests can be approved');
        }
        await this.balanceService.confirmDays(request.employeeId, request.locationId, request.daysRequested);
        request.status = time_off_request_entity_1.RequestStatus.APPROVED;
        return this.requestRepo.save(request);
    }
    async rejectRequest(id) {
        const request = await this.findOne(id);
        if (request.status !== time_off_request_entity_1.RequestStatus.PENDING) {
            throw new common_1.BadRequestException('Only PENDING requests can be rejected');
        }
        await this.balanceService.releasePendingDays(request.employeeId, request.locationId, request.daysRequested);
        request.status = time_off_request_entity_1.RequestStatus.REJECTED;
        return this.requestRepo.save(request);
    }
    async cancelRequest(id) {
        const request = await this.findOne(id);
        if (request.status === time_off_request_entity_1.RequestStatus.CANCELLED) {
            throw new common_1.BadRequestException('Already cancelled');
        }
        if (request.status === time_off_request_entity_1.RequestStatus.PENDING) {
            await this.balanceService.releasePendingDays(request.employeeId, request.locationId, request.daysRequested);
        }
        request.status = time_off_request_entity_1.RequestStatus.CANCELLED;
        return this.requestRepo.save(request);
    }
    async findOne(id) {
        const request = await this.requestRepo.findOne({ where: { id } });
        if (!request)
            throw new common_1.NotFoundException(`Request ${id} not found`);
        return request;
    }
};
exports.TimeOffService = TimeOffService;
exports.TimeOffService = TimeOffService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(time_off_request_entity_1.TimeOffRequest)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        balance_service_1.BalanceService,
        hcm_service_1.HcmService])
], TimeOffService);
//# sourceMappingURL=time-off.service.js.map