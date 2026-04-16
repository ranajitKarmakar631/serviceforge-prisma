import { Request } from "express";
/**
 * 👤 User Identity
 * Standard industrial user object injected by authentication middleware.
 */
export interface UserIdentity {
    id: string;
    email: string;
    role?: string;
    tenantId?: string;
    [key: string]: any;
}
/**
 * 📡 AuthenticatedRequest
 * Properly typed Express Request including the user identity.
 */
export interface AuthenticatedRequest extends Request {
    user?: UserIdentity;
}
/**
 * 📝 RequestWithBody
 * Typed request for operations involving a body and optional user session.
 */
export interface RequestWithBody<T> extends AuthenticatedRequest {
    body: T;
}
//# sourceMappingURL=types.d.ts.map