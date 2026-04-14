import { ZodError } from "zod";
import { ApiResponse } from "../utils/ApiResponse.js";
/**
 * ✅ Validation Middleware
 * Validates the request body, query, or params against a Zod schema.
 * @param schema - The Zod schema to validate against.
 */
export const validate = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            return next();
        }
        catch (error) {
            if (error instanceof ZodError) {
                return ApiResponse.error(res, "Validation failed", 400, error.issues.map((e) => ({
                    path: e.path.join("."),
                    message: e.message,
                })));
            }
            return next(error);
        }
    };
};
//# sourceMappingURL=validateMiddleware.js.map