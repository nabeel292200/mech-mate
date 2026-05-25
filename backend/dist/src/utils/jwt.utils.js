"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.signToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Sign a JWT token
 * @param {Object} payload - { id, phone, role }
 * @returns {string} signed token
 */
const signToken = (payload) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET environment variable is missing");
    }
    return jsonwebtoken_1.default.sign(payload, secret, {
        expiresIn: (process.env.JWT_EXPIRES_IN || "7d"),
    });
};
exports.signToken = signToken;
/**
 * Verify a JWT token
 * @param {string} token
 * @returns {any} decoded payload
 */
const verifyToken = (token) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET environment variable is missing");
    }
    return jsonwebtoken_1.default.verify(token, secret);
};
exports.verifyToken = verifyToken;
