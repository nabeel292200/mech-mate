"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.updateProfile = exports.getMe = exports.login = exports.register = void 0;
const User_model_1 = __importDefault(require("../models/User.model"));
const Mechanic_model_1 = __importDefault(require("../models/Mechanic.model"));
const jwt_utils_1 = require("../utils/jwt.utils");
const response_utils_1 = require("../utils/response.utils");
// ─────────────────────────────────────────────────────────────────
//  POST /api/auth/register
//  Body: { phone, password, role }
// ─────────────────────────────────────────────────────────────────
const register = async (req, res) => {
    const { phone, password, role } = req.body;
    // Basic validation
    const cleanPhone = (phone || "").replace(/\D/g, "");
    if (cleanPhone.length !== 10) {
        return (0, response_utils_1.sendError)(res, "A valid 10-digit phone number is required", 400);
    }
    if (!password || password.length < 6) {
        return (0, response_utils_1.sendError)(res, "Password must be at least 6 characters long", 400);
    }
    if (!["user", "mechanic"].includes(role)) {
        return (0, response_utils_1.sendError)(res, "Role must be 'user' or 'mechanic'", 400);
    }
    // Check if user already exists
    const existingUser = await User_model_1.default.findOne({ phone: cleanPhone });
    if (existingUser) {
        return (0, response_utils_1.sendError)(res, "An account with this phone number already exists. Please login.", 400);
    }
    // Pre-create mechanic document if role is mechanic
    let mechanicDoc = null;
    if (role === "mechanic") {
        mechanicDoc = await Mechanic_model_1.default.create({});
    }
    // Create user
    const user = await User_model_1.default.create({
        phone: cleanPhone,
        password,
        role,
        mechanic: mechanicDoc ? mechanicDoc._id : null,
    });
    // Issue JWT
    const token = (0, jwt_utils_1.signToken)({ id: user._id, phone: user.phone, role: user.role });
    console.log(`[AUTH]  REGISTER  phone=${cleanPhone}  role=${user.role}`);
    return (0, response_utils_1.sendSuccess)(res, {
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
    }, "Account created successfully", 201);
};
exports.register = register;
// ─────────────────────────────────────────────────────────────────
//  POST /api/auth/login
//  Body: { phone, password }
// ─────────────────────────────────────────────────────────────────
const login = async (req, res) => {
    const { phone, password } = req.body;
    const cleanPhone = (phone || "").replace(/\D/g, "");
    if (!cleanPhone || !password) {
        return (0, response_utils_1.sendError)(res, "Phone number and password are required", 400);
    }
    // Find user and include password field explicitly
    const user = await User_model_1.default.findOne({ phone: cleanPhone }).select("+password").populate("mechanic");
    if (!user) {
        return (0, response_utils_1.sendError)(res, "Invalid phone number or password", 401);
    }
    // Check isActive
    if (!user.isActive) {
        return (0, response_utils_1.sendError)(res, "Your account has been deactivated", 403);
    }
    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return (0, response_utils_1.sendError)(res, "Invalid phone number or password", 401);
    }
    // Double check that mechanic document exists if role is mechanic
    let mechanicDoc = user.mechanic;
    if (user.role === "mechanic" && !mechanicDoc) {
        mechanicDoc = await Mechanic_model_1.default.create({});
        user.mechanic = mechanicDoc._id;
        await User_model_1.default.updateOne({ _id: user._id }, { $set: { mechanic: mechanicDoc._id } });
    }
    // Issue JWT
    const token = (0, jwt_utils_1.signToken)({ id: user._id, phone: user.phone, role: user.role });
    console.log(`[AUTH]  LOGIN  phone=${cleanPhone}  role=${user.role}`);
    return (0, response_utils_1.sendSuccess)(res, {
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
    }, "Login successful");
};
exports.login = login;
// ─────────────────────────────────────────────────────────────────
//  GET /api/auth/me   (protected)
// ─────────────────────────────────────────────────────────────────
const getMe = async (req, res) => {
    return (0, response_utils_1.sendSuccess)(res, { user: req.user }, "User fetched successfully");
};
exports.getMe = getMe;
// ─────────────────────────────────────────────────────────────────
//  PUT /api/auth/profile   (protected)
// ─────────────────────────────────────────────────────────────────
const updateProfile = async (req, res) => {
    const user = req.user;
    if (!user) {
        return (0, response_utils_1.sendError)(res, "User not authenticated", 401);
    }
    const { name, phone, experience, workshopAddress, vehicleSkills, brandExpertise, liveLocation, isAvailable, } = req.body;
    if (name !== undefined)
        user.name = name;
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
                mechanicDoc = await Mechanic_model_1.default.findById(user.mechanic);
            }
            if (!mechanicDoc) {
                mechanicDoc = await Mechanic_model_1.default.create({});
            }
        }
        if (experience !== undefined)
            mechanicDoc.experience = Number(experience);
        if (workshopAddress !== undefined)
            mechanicDoc.workshopAddress = workshopAddress;
        if (vehicleSkills !== undefined)
            mechanicDoc.vehicleSkills = vehicleSkills;
        if (brandExpertise !== undefined)
            mechanicDoc.brandExpertise = brandExpertise;
        if (liveLocation !== undefined)
            mechanicDoc.liveLocation = !!liveLocation;
        if (isAvailable !== undefined)
            mechanicDoc.isAvailable = !!isAvailable;
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
    return (0, response_utils_1.sendSuccess)(res, { user }, "Profile updated successfully");
};
exports.updateProfile = updateProfile;
// ─────────────────────────────────────────────────────────────────
//  POST /api/auth/logout  (client-side token drop, server-side log)
// ─────────────────────────────────────────────────────────────────
const logout = async (req, res) => {
    return (0, response_utils_1.sendSuccess)(res, {}, "Logged out successfully");
};
exports.logout = logout;
