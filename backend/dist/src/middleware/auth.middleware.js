"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restrictTo = exports.protect = void 0;
const jwt_utils_1 = require("../utils/jwt.utils");
const response_utils_1 = require("../utils/response.utils");
const User_model_1 = __importDefault(require("../models/User.model"));
/**
 * Protect routes — validates Bearer token and attaches user to req
 */
const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return (0, response_utils_1.sendError)(res, "Unauthorized — no token provided", 401);
        }
        const token = authHeader.split(" ")[1];
        const decoded = (0, jwt_utils_1.verifyToken)(token);
        const user = await User_model_1.default.findById(decoded.id).select("-__v").populate("mechanic");
        if (!user) {
            return (0, response_utils_1.sendError)(res, "User belonging to this token no longer exists", 401);
        }
        if (!user.isActive) {
            return (0, response_utils_1.sendError)(res, "Your account has been deactivated", 403);
        }
        req.user = user;
        next();
    }
    catch (err) {
        if (err.name === "TokenExpiredError") {
            return (0, response_utils_1.sendError)(res, "Token expired — please log in again", 401);
        }
        return (0, response_utils_1.sendError)(res, "Invalid token", 401);
    }
};
exports.protect = protect;
/**
 * Restrict to specific roles
 * Usage: restrictTo("mechanic") or restrictTo("user", "mechanic")
 */
const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return (0, response_utils_1.sendError)(res, `Access denied — ${req.user ? req.user.role : "guest"}s cannot perform this action`, 403);
        }
        next();
    };
};
exports.restrictTo = restrictTo;
