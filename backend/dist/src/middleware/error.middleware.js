"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = exports.errorHandler = void 0;
const response_utils_1 = require("../utils/response.utils");
/**
 * Global error handler — must be last middleware in app.js
 */
const errorHandler = (err, req, res, next) => {
    console.error(`[ERROR] ${err.message || err}`);
    // Mongoose validation error
    if (err.name === "ValidationError") {
        const errors = Object.values(err.errors || {}).map((e) => e.message);
        return (0, response_utils_1.sendError)(res, "Validation failed", 400, errors);
    }
    // Mongoose duplicate key
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0] || "field";
        return (0, response_utils_1.sendError)(res, `${field} already exists`, 409);
    }
    // Mongoose cast error (bad ObjectId)
    if (err.name === "CastError") {
        return (0, response_utils_1.sendError)(res, `Invalid ${err.path}: ${err.value}`, 400);
    }
    // JWT errors
    if (err.name === "JsonWebTokenError") {
        return (0, response_utils_1.sendError)(res, "Invalid token", 401);
    }
    if (err.name === "TokenExpiredError") {
        return (0, response_utils_1.sendError)(res, "Token expired — please log in again", 401);
    }
    // Generic / unhandled
    const statusCode = err.statusCode || 500;
    const message = process.env.NODE_ENV === "production" && statusCode === 500
        ? "Internal server error"
        : err.message || "Internal server error";
    return (0, response_utils_1.sendError)(res, message, statusCode);
};
exports.errorHandler = errorHandler;
/**
 * 404 handler — mount before errorHandler
 */
const notFound = (req, res, next) => {
    const err = new Error(`Route not found: ${req.originalUrl}`);
    err.statusCode = 404;
    next(err);
};
exports.notFound = notFound;
