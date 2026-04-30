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
exports.TimeOffController = void 0;
const common_1 = require("@nestjs/common");
const time_off_service_1 = require("./time-off.service");
const balance_service_1 = require("../balance/balance.service");
const create_request_dto_1 = require("./dto/create-request.dto");
let TimeOffController = class TimeOffController {
    timeOffService;
    balanceService;
    constructor(timeOffService, balanceService) {
        this.timeOffService = timeOffService;
        this.balanceService = balanceService;
    }
    create(dto) {
        return this.timeOffService.createRequest(dto);
    }
    findOne(id) {
        return this.timeOffService.findOne(+id);
    }
    getBalance(employeeId, locationId) {
        return this.balanceService.getBalance(employeeId, locationId);
    }
    approve(id) {
        return this.timeOffService.approveRequest(+id);
    }
    reject(id) {
        return this.timeOffService.rejectRequest(+id);
    }
    cancel(id) {
        return this.timeOffService.cancelRequest(+id);
    }
};
exports.TimeOffController = TimeOffController;
__decorate([
    (0, common_1.Post)('request'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_request_dto_1.CreateRequestDto]),
    __metadata("design:returntype", void 0)
], TimeOffController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('request/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TimeOffController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('balance/:employeeId/:locationId'),
    __param(0, (0, common_1.Param)('employeeId')),
    __param(1, (0, common_1.Param)('locationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], TimeOffController.prototype, "getBalance", null);
__decorate([
    (0, common_1.Patch)('request/:id/approve'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TimeOffController.prototype, "approve", null);
__decorate([
    (0, common_1.Patch)('request/:id/reject'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TimeOffController.prototype, "reject", null);
__decorate([
    (0, common_1.Delete)('request/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TimeOffController.prototype, "cancel", null);
exports.TimeOffController = TimeOffController = __decorate([
    (0, common_1.Controller)('time-off'),
    __metadata("design:paramtypes", [time_off_service_1.TimeOffService,
        balance_service_1.BalanceService])
], TimeOffController);
//# sourceMappingURL=time-off.controller.js.map