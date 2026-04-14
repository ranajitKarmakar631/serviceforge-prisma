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
export declare class AuthUtils {
    /**
     * Generate an Access Token
     */
    static generateAccessToken(payload: TokenPayload, secret: string, expiresIn?: string | number): string;
    /**
     * Verify an Access Token
     */
    static verifyAccessToken(token: string, secret: string): TokenPayload;
    /**
     * Generate a Refresh Token
     */
    static generateRefreshToken(payload: TokenPayload, secret: string, expiresIn?: string | number): string;
    /**
     * Verify a Refresh Token
     */
    static verifyRefreshToken(token: string, secret: string): TokenPayload;
}
//# sourceMappingURL=auth.utill.d.ts.map