import { type Request, type Response, type NextFunction } from 'express';
/**
 * 🎣 catchAsync Wrapper
 * Wraps an async function and catches any errors to pass them to next().
 * This eliminates the need for try-catch blocks in controllers.
 */
export declare const catchAsync: (fn: Function) => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=catchAsync.d.ts.map