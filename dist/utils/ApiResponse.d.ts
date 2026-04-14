import type { Response } from 'express';
export declare class ApiResponse {
    static success(res: Response, message: string, data?: any, statusCode?: number): Response<any, Record<string, any>>;
    static error(res: Response, message: string, statusCode?: number, error?: any): Response<any, Record<string, any>>;
}
//# sourceMappingURL=ApiResponse.d.ts.map