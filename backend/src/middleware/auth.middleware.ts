import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.utils";
import { sendError } from "../utils/response.utils";
import User, { IUser } from "../models/User.model";

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

/**
 * Protect routes — validates Bearer token and attaches user to req
 */
export const protect = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return sendError(res, "Unauthorized — no token provided", 401);
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    const user = await User.findById(decoded.id).select("-__v");
    if (!user) {
      return sendError(res, "User belonging to this token no longer exists", 401);
    }

    if (!user.isActive) {
      return sendError(res, "Your account has been deactivated", 403);
    }

    req.user = user;
    next();
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      return sendError(res, "Token expired — please log in again", 401);
    }
    return sendError(res, "Invalid token", 401);
  }
};

/**
 * Restrict to specific roles
 * Usage: restrictTo("mechanic") or restrictTo("user", "mechanic")
 */
export const restrictTo = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return sendError(
        res,
        `Access denied — ${req.user ? req.user.role : "guest"}s cannot perform this action`,
        403
      );
    }
    next();
  };
};
