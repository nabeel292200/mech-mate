"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendError = exports.sendSuccess = void 0;
const sendSuccess = (res, data = {}, message = "Success", statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};
exports.sendSuccess = sendSuccess;
const sendError = (res, message = "Something went wrong", statusCode = 400, errors = null) => {
    const body = {
        success: false,
        message,
    };
    if (errors)
        body.errors = errors;
    return res.status(statusCode).json(body);
};
exports.sendError = sendError;
