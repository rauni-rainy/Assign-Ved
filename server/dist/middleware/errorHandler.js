"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    console.error(err);
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    if (err.name === 'ZodError') {
        statusCode = 400;
        try {
            const parsedErrors = JSON.parse(err.message);
            message = parsedErrors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
        }
        catch {
            message = 'Validation Error';
        }
    }
    res.status(statusCode).json({
        success: false,
        error: message,
        code: statusCode,
    });
};
exports.errorHandler = errorHandler;
