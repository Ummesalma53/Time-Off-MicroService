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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncService = void 0;
const common_1 = require("@nestjs/common");
const balance_service_1 = require("../balance/balance.service");
let SyncService = class SyncService {
    balanceService;
    constructor(balanceService) {
        this.balanceService = balanceService;
    }
    async batchSync(records) {
        const results = [];
        for (const record of records) {
            const updated = await this.balanceService.upsertBalance(record.employeeId, record.locationId, record.totalDays);
            results.push(updated);
        }
        return { synced: results.length, records: results };
    }
    async realtimeSync(employeeId, locationId, totalDays) {
        return this.balanceService.upsertBalance(employeeId, locationId, totalDays);
    }
};
exports.SyncService = SyncService;
exports.SyncService = SyncService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [balance_service_1.BalanceService])
], SyncService);
//# sourceMappingURL=sync.service.js.map