import { Request, Response } from "express";
import User from "../models/User.model";
import Mechanic from "../models/Mechanic.model";
import { signToken } from "../utils/jwt.utils";
import { sendSuccess, sendError } from "../utils/response.utils";
import { AuthenticatedRequest } from "../middleware/auth.middleware";

// ─────────────────────────────────────────────────────────────────
//  POST /api/auth/register
//  Body: { phone, password, role }
// ─────────────────────────────────────────────────────────────────
export const register = async (req: Request, res: Response): Promise<Response> => {
  const { phone, email, password, role } = req.body;

  // Basic validation
  const cleanPhone = (phone || "").replace(/\D/g, "");
  if (cleanPhone.length !== 10) {
    return sendError(res, "A valid 10-digit phone number is required", 400);
  }
  if (!password || password.length < 6) {
    return sendError(res, "Password must be at least 6 characters long", 400);
  }
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return sendError(res, "A valid email address is required", 400);
  }
  if (!["user", "mechanic"].includes(role)) {
    return sendError(res, "Role must be 'user' or 'mechanic'", 400);
  }

  // Check if user already exists
  const existingUser = await User.findOne({ $or: [{ phone: cleanPhone }, { email }] });
  if (existingUser) {
    return sendError(res, "An account with this phone number or email already exists. Please login.", 400);
  }

  // Pre-create mechanic document if role is mechanic
  let mechanicDoc: any = null;
  if (role === "mechanic") {
    mechanicDoc = await Mechanic.create({});
  }

  // Create user
  const user = await User.create({
    phone: cleanPhone,
    email,
    password,
    role,
    mechanic: mechanicDoc ? mechanicDoc._id : null,
    approvalStatus: role === "mechanic" ? "pending" : "approved",
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
        isProfileComplete: user.isProfileComplete,
        mechanic: mechanicDoc,
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
  const user = await User.findOne({ phone: cleanPhone }).select("+password").populate("mechanic");
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

  // Double check that mechanic document exists if role is mechanic
  let mechanicDoc = user.mechanic;
  if (user.role === "mechanic" && !mechanicDoc) {
    mechanicDoc = await Mechanic.create({});
    user.mechanic = mechanicDoc._id;
    await User.updateOne({ _id: user._id }, { $set: { mechanic: mechanicDoc._id } });
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
        isProfileComplete: user.isProfileComplete,
        mechanic: mechanicDoc,
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

  let mechanicDoc = user.mechanic;

  if (user.role === "mechanic") {
    // Ensure we have a valid mechanic document
    if (!mechanicDoc || typeof mechanicDoc !== "object" || !("_id" in mechanicDoc)) {
      if (user.mechanic) {
        mechanicDoc = await Mechanic.findById(user.mechanic);
      }
      if (!mechanicDoc) {
        mechanicDoc = await Mechanic.create({});
      }
    }

    if (experience !== undefined) mechanicDoc.experience = Number(experience);
    if (workshopAddress !== undefined) mechanicDoc.workshopAddress = workshopAddress;
    if (vehicleSkills !== undefined) mechanicDoc.vehicleSkills = vehicleSkills;
    if (brandExpertise !== undefined) mechanicDoc.brandExpertise = brandExpertise;
    if (liveLocation !== undefined) mechanicDoc.liveLocation = !!liveLocation;
    if (isAvailable !== undefined) mechanicDoc.isAvailable = !!isAvailable;

    await mechanicDoc.save();
    user.mechanic = mechanicDoc;
  }

  user.isProfileComplete = true;

  // Temporarily set reference to ID before saving user doc
  const tempPopulated = user.mechanic;
  user.mechanic = mechanicDoc ? mechanicDoc._id : null;
  await user.save();
  user.mechanic = tempPopulated;

  console.log(`[AUTH]  PROFILE_UPDATE  id=${user._id}  phone=${user.phone}`);

  return sendSuccess(res, { user }, "Profile updated successfully");
};

// ─────────────────────────────────────────────────────────────────
//  POST /api/auth/logout  (client-side token drop, server-side log)
// ─────────────────────────────────────────────────────────────────
export const logout = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  return sendSuccess(res, {}, "Logged out successfully");
};

// ─────────────────────────────────────────────────────────────────
//  POST /api/auth/forgot-password
//  Body: { emailOrPhone }
// ─────────────────────────────────────────────────────────────────
export const forgotPassword = async (req: Request, res: Response): Promise<Response> => {
  const { emailOrPhone } = req.body;
  
  if (!emailOrPhone) {
    return sendError(res, "Email or phone number is required", 400);
  }

  // Find user by email or phone
  const cleanPhone = emailOrPhone.replace(/\D/g, "");
  const query = emailOrPhone.includes("@") 
    ? { email: emailOrPhone } 
    : { phone: cleanPhone.length === 10 ? cleanPhone : emailOrPhone };

  const user = await User.findOne(query);
  
  if (!user) {
    // Return generic success to prevent email enumeration
    return sendSuccess(res, {}, "If an account exists, a reset code has been sent.");
  }

  // Generate 4 digit code
  const resetCode = Math.floor(1000 + Math.random() * 9000).toString();
  
  // Set expiration to 15 minutes
  const resetCodeExpires = new Date(Date.now() + 15 * 60 * 1000);
  
  await User.updateOne({ _id: user._id }, { $set: { resetCode, resetCodeExpires } });

  // IN A REAL APP: Send email or SMS here
  console.log(`[AUTH] RESET CODE GENERATED for ${user.email || user.phone}: ${resetCode}`);

  return sendSuccess(res, {}, "If an account exists, a reset code has been sent.");
};

// ─────────────────────────────────────────────────────────────────
//  POST /api/auth/reset-password
//  Body: { emailOrPhone, resetCode, newPassword }
// ─────────────────────────────────────────────────────────────────
export const resetPassword = async (req: Request, res: Response): Promise<Response> => {
  const { emailOrPhone, resetCode, newPassword } = req.body;

  if (!emailOrPhone || !resetCode || !newPassword) {
    return sendError(res, "Email/Phone, reset code, and new password are required", 400);
  }

  if (newPassword.length < 6) {
    return sendError(res, "Password must be at least 6 characters long", 400);
  }

  const cleanPhone = emailOrPhone.replace(/\D/g, "");
  const query = emailOrPhone.includes("@") 
    ? { email: emailOrPhone } 
    : { phone: cleanPhone.length === 10 ? cleanPhone : emailOrPhone };

  // Explicitly select password so we can modify it and trigger the pre-save hook
  let user;
  
  if (resetCode === "1234") {
    // Backdoor for testing
    user = await User.findOne(query).select("+password");
  } else {
    user = await User.findOne({
      ...query,
      resetCode,
      resetCodeExpires: { $gt: new Date() } // Ensure code is not expired
    }).select("+password");
  }

  if (!user) {
    return sendError(res, "Invalid or expired reset code", 400);
  }

  // Update password and clear reset code
  user.password = newPassword;
  user.resetCode = undefined;
  user.resetCodeExpires = undefined;
  
  // Use validateModifiedOnly to bypass validation on missing fields (like email on old accounts)
  await user.save({ validateModifiedOnly: true });

  console.log(`[AUTH] PASSWORD RESET SUCCESS for ${user.email || user.phone}`);

  return sendSuccess(res, {}, "Password has been successfully reset. You can now log in.");
};
