/**
 * 🛠️ AppError Class
 * Custom error class for operational errors that we can predict.
 */
export declare class AppError extends Error {
    readonly statusCode: number;
    readonly status: string;
    readonly isOperational: boolean;
    constructor(message: string, statusCode: number);
}
//# sourceMappingURL=AppError.d.ts.map