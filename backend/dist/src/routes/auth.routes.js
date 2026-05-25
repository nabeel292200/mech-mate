"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
// Rate limiter — 30 auth requests per 15 min per IP
const authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 30,
    message: { success: false, message: "Too many auth requests. Try again in 15 minutes." },
    standardHeaders: true,
    legacyHeaders: false,
});
// Public routes
router.post("/register", authLimiter, auth_controller_1.register);
router.post("/login", authLimiter, auth_controller_1.login);
// Protected routes
router.get("/me", auth_middleware_1.protect, auth_controller_1.getMe);
router.put("/profile", auth_middleware_1.protect, auth_controller_1.updateProfile);
router.post("/logout", auth_middleware_1.protect, auth_controller_1.logout);
exports.default = router;
