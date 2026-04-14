import { Request, Response, NextFunction } from "express";
/**
 * 🚨 Global Error Middleware
 * Catches all errors and sends a standardized JSON response.
 * Handles Prisma-specific errors and maps them to HTTP status codes.
 */
export declare const errorMiddleware: (err: any, req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
//# sourceMappingURL=errorMiddleware.d.ts.map