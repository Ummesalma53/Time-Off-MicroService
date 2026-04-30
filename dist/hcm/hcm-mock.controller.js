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
exports.HcmMockController = void 0;
const common_1 = require("@nestjs/common");
const mockBalances = {
    'emp1_loc1': 10,
    'emp2_loc1': 5,
};
let HcmMockController = class HcmMockController {
    getBalance(employeeId, locationId) {
        const key = `${employeeId}_${locationId}`;
        const balance = mockBalances[key] ?? 0;
        return { employeeId, locationId, balance };
    }
    deductBalance(body) {
        const key = `${body.employeeId}_${body.locationId}`;
        if (mockBalances[key] === undefined)
            return { success: false, error: 'Invalid employee/location' };
        if (mockBalances[key] < body.days)
            return { success: false, error: 'Insufficient balance' };
        mockBalances[key] -= body.days;
        return { success: true, remaining: mockBalances[key] };
    }
    anniversaryBonus(body) {
        const key = `${body.employeeId}_${body.locationId}`;
        if (!mockBalances[key])
            mockBalances[key] = 0;
        mockBalances[key] += body.bonus;
        return { success: true, newBalance: mockBalances[key] };
    }
};
exports.HcmMockController = HcmMockController;
__decorate([
    (0, common_1.Get)('balance/:employeeId/:locationId'),
    __param(0, (0, common_1.Param)('employeeId')),
    __param(1, (0, common_1.Param)('locationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], HcmMockController.prototype, "getBalance", null);
__decorate([
    (0, common_1.Post)('deduct'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], HcmMockController.prototype, "deductBalance", null);
__decorate([
    (0, common_1.Post)('anniversary-bonus'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], HcmMockController.prototype, "anniversaryBonus", null);
exports.HcmMockController = HcmMockController = __decorate([
    (0, common_1.Controller)('hcm')
], HcmMockController);
//# sourceMappingURL=hcm-mock.controller.js.map