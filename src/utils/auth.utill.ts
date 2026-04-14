import jwt from "jsonwebtoken";
import { AppError } from "./AppError.js";
import logger from "./logger.js";

export interface TokenPayload {
  id: string;
  email?: string;
  role?: string;
  [key: string]: any;
}

/**
 * 🔐 AuthUtils
 * Standard utility for JWT token management across microservices.
 */
export class AuthUtils {
  /**
   * Generate an Access Token
   */
  static generateAccessToken(
    payload: TokenPayload,
    secret: string,
    expiresIn: string | number = "1h"
  ): string {
    try {
      return jwt.sign(payload, secret, { expiresIn: expiresIn as any });
    } catch (error: any) {
      logger.error(`Error generating access token: ${error.message}`);
      throw new AppError("Could not generate access token", 500);
    }
  }

  /**
   * Verify an Access Token
   */
  static verifyAccessToken(token: string, secret: string): TokenPayload {
    try {
      return jwt.verify(token, secret) as TokenPayload;
    } catch (error: any) {
      logger.warn(`Invalid access token: ${error.message}`);
      throw new AppError("Invalid or expired token", 401);
    }
  }

  /**
   * Generate a Refresh Token
   */
  static generateRefreshToken(
    payload: TokenPayload,
    secret: string,
    expiresIn: string | number = "7d"
  ): string {
    try {
      return jwt.sign(payload, secret, { expiresIn: expiresIn as any });
    } catch (error: any) {
      logger.error(`Error generating refresh token: ${error.message}`);
      throw new AppError("Could not generate refresh token", 500);
    }
  }

  /**
   * Verify a Refresh Token
   */
  static verifyRefreshToken(token: string, secret: string): TokenPayload {
    try {
      return jwt.verify(token, secret) as TokenPayload;
    } catch (error: any) {
      logger.warn(`Invalid refresh token: ${error.message}`);
      throw new AppError("Invalid or expired refresh token", 401);
    }
  }
}