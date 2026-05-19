import express from "express";
import rateLimit from "express-rate-limit";
import { register, login, getMe, logout, updateProfile } from "../controllers/auth.controller";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

// Rate limiter — 30 auth requests per 15 min per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { success: false, message: "Too many auth requests. Try again in 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Public routes
router.post("/register", authLimiter, register as any);
router.post("/login",    authLimiter, login as any);

// Protected routes
router.get("/me",       protect as any, getMe as any);
router.put("/profile",  protect as any, updateProfile as any);
router.post("/logout",  protect as any, logout as any);

export default router;
