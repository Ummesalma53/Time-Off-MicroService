export declare class HcmMockController {
    getBalance(employeeId: string, locationId: string): {
        employeeId: string;
        locationId: string;
        balance: number;
    };
    deductBalance(body: {
        employeeId: string;
        locationId: string;
        days: number;
    }): {
        success: boolean;
        error: string;
        remaining?: undefined;
    } | {
        success: boolean;
        remaining: number;
        error?: undefined;
    };
    anniversaryBonus(body: {
        employeeId: string;
        locationId: string;
        bonus: number;
    }): {
        success: boolean;
        newBalance: number;
    };
}
