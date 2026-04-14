import type { Response } from 'express';

export class ApiResponse {
  static success(res: Response, message: string, data?: any, statusCode: number = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      result: data,
      timestamp: new Date().toISOString()
    });
  }

  static error(res: Response, message: string, statusCode: number = 500, error?: any) {
    return res.status(statusCode).json({
      success: false,
      message,
      error: process.env.NODE_ENV === 'development' ? error : undefined,
      timestamp: new Date().toISOString()
    });
  }
}