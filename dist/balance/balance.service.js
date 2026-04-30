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
exports.BalanceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const balance_entity_1 = require("./balance.entity");
let BalanceService = class BalanceService {
    balanceRepo;
    constructor(balanceRepo) {
        this.balanceRepo = balanceRepo;
    }
    async getBalance(employeeId, locationId) {
        const balance = await this.balanceRepo.findOne({
            where: { employeeId, locationId },
        });
        if (!balance)
            throw new common_1.NotFoundException('Balance not found');
        return balance;
    }
    async getAvailableDays(employeeId, locationId) {
        const balance = await this.getBalance(employeeId, locationId);
        return balance.totalDays - balance.usedDays - balance.pendingDays;
    }
    async reserveDays(employeeId, locationId, days) {
        const balance = await this.getBalance(employeeId, locationId);
        const available = balance.totalDays - balance.usedDays - balance.pendingDays;
        if (available < days)
            throw new Error('Insufficient balance');
        balance.pendingDays += days;
        await this.balanceRepo.save(balance);
    }
    async confirmDays(employeeId, locationId, days) {
        const balance = await this.getBalance(employeeId, locationId);
        balance.pendingDays -= days;
        balance.usedDays += days;
        await this.balanceRepo.save(balance);
    }
    async releasePendingDays(employeeId, locationId, days) {
        const balance = await this.getBalance(employeeId, locationId);
        balance.pendingDays = Math.max(0, balance.pendingDays - days);
        await this.balanceRepo.save(balance);
    }
    async upsertBalance(employeeId, locationId, totalDays) {
        let balance = await this.balanceRepo.findOne({ where: { employeeId, locationId } });
        if (!balance) {
            balance = this.balanceRepo.create({ employeeId, locationId, totalDays });
        }
        else {
            balance.totalDays = totalDays;
        }
        return this.balanceRepo.save(balance);
    }
};
exports.BalanceService = BalanceService;
exports.BalanceService = BalanceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(balance_entity_1.Balance)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], BalanceService);
//# sourceMappingURL=balance.service.js.map