"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const time_off_module_1 = require("./time-off/time-off.module");
const balance_module_1 = require("./balance/balance.module");
const hcm_module_1 = require("./hcm/hcm.module");
const sync_module_1 = require("./sync/sync.module");
const balance_entity_1 = require("./balance/balance.entity");
const time_off_request_entity_1 = require("./time-off/time-off-request.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: 'better-sqlite3',
                database: 'timeoff.db',
                entities: [balance_entity_1.Balance, time_off_request_entity_1.TimeOffRequest],
                synchronize: true,
            }),
            time_off_module_1.TimeOffModule,
            balance_module_1.BalanceModule,
            hcm_module_1.HcmModule,
            sync_module_1.SyncModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map