import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import logger from "../utils/logger.js";

/**
 * 🚨 Global Error Middleware
 * Catches all errors and sends a standardized JSON response.
 * Handles Prisma-specific errors and maps them to HTTP status codes.
 */
export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // 📝 Log the error
  logger.error(`[${req.method}] ${req.url} - ${err.message}`, {
    stack: err.stack,
    body: req.body,
    user: (req as any).user?.id,
  });

  // 🛠️ Handle Prisma Errors
  if (err.code === "P2002") {
    // Unique constraint violation
    const field = err.meta?.target || "field";
    return ApiResponse.error(res, `Duplicate value for ${field}`, 400, err);
  }

  if (err.code === "P2025") {
    // Record not found
    return ApiResponse.error(res, "Record not found", 404, err);
  }

  if (err.name === "ValidationError") {
    return ApiResponse.error(res, err.message, 400, err);
  }

  // 🌍 Production vs Development responses
  if (process.env.NODE_ENV === "development") {
    return res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message,
      stack: err.stack,
      error: err,
    });
  }

  // 🔒 Production: Don't leak sensitive error details
  return ApiResponse.error(
    res,
    err.isOperational ? err.message : "Something went very wrong!",
    err.statusCode
  );
};
