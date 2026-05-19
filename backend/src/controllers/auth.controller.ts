import { Request, Response } from "express";
import User from "../models/User.model";
import { signToken } from "../utils/jwt.utils";
import { sendSuccess, sendError } from "../utils/response.utils";
import { AuthenticatedRequest } from "../middleware/auth.middleware";

// ─────────────────────────────────────────────────────────────────
//  POST /api/auth/register
//  Body: { phone, password, role }
// ─────────────────────────────────────────────────────────────────
export const register = async (req: Request, res: Response): Promise<Response> => {
  const { phone, password, role } = req.body;

  // Basic validation
  const cleanPhone = (phone || "").replace(/\D/g, "");
  if (cleanPhone.length !== 10) {
    return sendError(res, "A valid 10-digit phone number is required", 400);
  }
  if (!password || password.length < 6) {
    return sendError(res, "Password must be at least 6 characters long", 400);
  }
  if (!["user", "mechanic"].includes(role)) {
    return sendError(res, "Role must be 'user' or 'mechanic'", 400);
  }

  // Check if user already exists
  const existingUser = await User.findOne({ phone: cleanPhone });
  if (existingUser) {
    return sendError(res, "An account with this phone number already exists. Please login.", 400);
  }

  // Create user
  const user = await User.create({
    phone: cleanPhone,
    password,
    role,
  });

  // Issue JWT
  const token = signToken({ id: user._id, phone: user.phone, role: user.role });

  console.log(`[AUTH]  REGISTER  phone=${cleanPhone}  role=${user.role}`);

  return sendSuccess(
    res,
    {
      token,
      role: user.role,
      isProfileComplete: user.isProfileComplete,
      user: {
        id: user._id,
        phone: user.phone,
        name: user.name,
        role: user.role,
      },
    },
    "Account created successfully",
    201
  );
};

// ─────────────────────────────────────────────────────────────────
//  POST /api/auth/login
//  Body: { phone, password }
// ─────────────────────────────────────────────────────────────────
export const login = async (req: Request, res: Response): Promise<Response> => {
  const { phone, password } = req.body;

  const cleanPhone = (phone || "").replace(/\D/g, "");
  if (!cleanPhone || !password) {
    return sendError(res, "Phone number and password are required", 400);
  }

  // Find user and include password field explicitly
  const user = await User.findOne({ phone: cleanPhone }).select("+password");
  if (!user) {
    return sendError(res, "Invalid phone number or password", 401);
  }

  // Check isActive
  if (!user.isActive) {
    return sendError(res, "Your account has been deactivated", 403);
  }

  // Compare password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return sendError(res, "Invalid phone number or password", 401);
  }

  // Issue JWT
  const token = signToken({ id: user._id, phone: user.phone, role: user.role });

  console.log(`[AUTH]  LOGIN  phone=${cleanPhone}  role=${user.role}`);

  return sendSuccess(
    res,
    {
      token,
      role: user.role,
      isProfileComplete: user.isProfileComplete,
      user: {
        id: user._id,
        phone: user.phone,
        name: user.name,
        role: user.role,
      },
    },
    "Login successful"
  );
};

// ─────────────────────────────────────────────────────────────────
//  GET /api/auth/me   (protected)
// ─────────────────────────────────────────────────────────────────
export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  return sendSuccess(res, { user: req.user }, "User fetched successfully");
};

// ─────────────────────────────────────────────────────────────────
//  PUT /api/auth/profile   (protected)
// ─────────────────────────────────────────────────────────────────
export const updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  const user = req.user;
  if (!user) {
    return sendError(res, "User not authenticated", 401);
  }

  const {
    name,
    phone,
    experience,
    workshopAddress,
    vehicleSkills,
    brandExpertise,
    liveLocation,
    isAvailable,
  } = req.body;

  if (name !== undefined) user.name = name;
  if (phone !== undefined) {
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length === 10) {
      user.phone = cleanPhone;
    }
  }

  if (user.role === "mechanic") {
    if (experience !== undefined) user.mechanic.experience = Number(experience);
    if (workshopAddress !== undefined) user.mechanic.workshopAddress = workshopAddress;
    if (vehicleSkills !== undefined) user.mechanic.vehicleSkills = vehicleSkills;
    if (brandExpertise !== undefined) user.mechanic.brandExpertise = brandExpertise;
    if (liveLocation !== undefined) user.mechanic.liveLocation = !!liveLocation;
    if (isAvailable !== undefined) user.mechanic.isAvailable = !!isAvailable;
  }

  user.isProfileComplete = true;
  await user.save();

  console.log(`[AUTH]  PROFILE_UPDATE  id=${user._id}  phone=${user.phone}`);

  return sendSuccess(res, { user }, "Profile updated successfully");
};

// ─────────────────────────────────────────────────────────────────
//  POST /api/auth/logout  (client-side token drop, server-side log)
// ─────────────────────────────────────────────────────────────────
export const logout = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  return sendSuccess(res, {}, "Logged out successfully");
};
