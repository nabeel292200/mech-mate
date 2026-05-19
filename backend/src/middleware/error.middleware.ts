import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/response.utils";

/**
 * Global error handler — must be last middleware in app.js
 */
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): Response => {
  console.error(`[ERROR] ${err.message || err}`);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors || {}).map((e: any) => e.message);
    return sendError(res, "Validation failed", 400, errors);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    return sendError(res, `${field} already exists`, 409);
  }

  // Mongoose cast error (bad ObjectId)
  if (err.name === "CastError") {
    return sendError(res, `Invalid ${err.path}: ${err.value}`, 400);
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return sendError(res, "Invalid token", 401);
  }
  if (err.name === "TokenExpiredError") {
    return sendError(res, "Token expired — please log in again", 401);
  }

  // Generic / unhandled
  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === "production" && statusCode === 500
      ? "Internal server error"
      : err.message || "Internal server error";

  return sendError(res, message, statusCode);
};

/**
 * 404 handler — mount before errorHandler
 */
export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const err = new Error(`Route not found: ${req.originalUrl}`) as any;
  err.statusCode = 404;
  next(err);
};
