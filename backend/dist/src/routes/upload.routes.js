"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const upload_middleware_1 = require("../middleware/upload.middleware");
const User_model_1 = __importDefault(require("../models/User.model"));
const Mechanic_model_1 = __importDefault(require("../models/Mechanic.model"));
const router = (0, express_1.Router)();
// ── POST /api/upload/avatar  (any authenticated user) ──────────────
// Saves the Cloudinary URL to user.avatar in MongoDB
router.post("/avatar", auth_middleware_1.protect, upload_middleware_1.uploadAvatar.single("avatar"), async (req, res) => {
    try {
        const user = req.user;
        if (!user)
            return res.status(401).json({ success: false, message: "Unauthorized" });
        const file = req.file;
        if (!file)
            return res.status(400).json({ success: false, message: "No file uploaded" });
        // Attach URL directly to user document
        await User_model_1.default.findByIdAndUpdate(user._id, { avatar: file.path });
        return res.json({
            success: true,
            message: "Avatar uploaded successfully",
            data: { avatarUrl: file.path },
        });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});
// ── POST /api/upload/id-proof  (mechanic only) ─────────────────────
// Saves the Cloudinary URL to mechanic.idProofUrl in MongoDB
router.post("/id-proof", auth_middleware_1.protect, upload_middleware_1.uploadIdProof.single("idProof"), async (req, res) => {
    try {
        const user = req.user;
        if (!user)
            return res.status(401).json({ success: false, message: "Unauthorized" });
        if (user.role !== "mechanic")
            return res.status(403).json({ success: false, message: "Only mechanics can upload ID proof" });
        const file = req.file;
        if (!file)
            return res.status(400).json({ success: false, message: "No file uploaded" });
        // Attach URL to mechanic document
        await Mechanic_model_1.default.findByIdAndUpdate(user.mechanic, { idProofUrl: file.path });
        return res.json({
            success: true,
            message: "ID proof uploaded successfully",
            data: { idProofUrl: file.path },
        });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});
exports.default = router;
