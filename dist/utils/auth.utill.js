import jwt from "jsonwebtoken";
import { AppError } from "./AppError.js";
import logger from "./logger.js";
/**
 * 🔐 AuthUtils
 * Standard utility for JWT token management across microservices.
 */
export class AuthUtils {
    /**
     * Generate an Access Token
     */
    static generateAccessToken(payload, secret, expiresIn = "1h") {
        try {
            return jwt.sign(payload, secret, { expiresIn: expiresIn });
        }
        catch (error) {
            logger.error(`Error generating access token: ${error.message}`);
            throw new AppError("Could not generate access token", 500);
        }
    }
    /**
     * Verify an Access Token
     */
    static verifyAccessToken(token, secret) {
        try {
            return jwt.verify(token, secret);
        }
        catch (error) {
            logger.warn(`Invalid access token: ${error.message}`);
            throw new AppError("Invalid or expired token", 401);
        }
    }
    /**
     * Generate a Refresh Token
     */
    static generateRefreshToken(payload, secret, expiresIn = "7d") {
        try {
            return jwt.sign(payload, secret, { expiresIn: expiresIn });
        }
        catch (error) {
            logger.error(`Error generating refresh token: ${error.message}`);
            throw new AppError("Could not generate refresh token", 500);
        }
    }
    /**
     * Verify a Refresh Token
     */
    static verifyRefreshToken(token, secret) {
        try {
            return jwt.verify(token, secret);
        }
        catch (error) {
            logger.warn(`Invalid refresh token: ${error.message}`);
            throw new AppError("Invalid or expired refresh token", 401);
        }
    }
}
//# sourceMappingURL=auth.utill.js.map