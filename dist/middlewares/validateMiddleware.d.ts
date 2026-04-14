import { Request, Response, NextFunction } from "express";
import { ZodObject } from "zod";
/**
 * ✅ Validation Middleware
 * Validates the request body, query, or params against a Zod schema.
 * @param schema - The Zod schema to validate against.
 */
export declare const validate: (schema: ZodObject<any>) => (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
//# sourceMappingURL=validateMiddleware.d.ts.map