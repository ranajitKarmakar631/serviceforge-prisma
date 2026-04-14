import { type Request, type Response, type NextFunction } from 'express';

/**
 * 🎣 catchAsync Wrapper
 * Wraps an async function and catches any errors to pass them to next().
 * This eliminates the need for try-catch blocks in controllers.
 */
export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
