export class ApiResponse {
    static success(res, message, data, statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            message,
            result: data,
            timestamp: new Date().toISOString()
        });
    }
    static error(res, message, statusCode = 500, error) {
        return res.status(statusCode).json({
            success: false,
            message,
            error: process.env.NODE_ENV === 'development' ? error : undefined,
            timestamp: new Date().toISOString()
        });
    }
}
//# sourceMappingURL=ApiResponse.js.map