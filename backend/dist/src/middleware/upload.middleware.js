"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadIdProof = exports.uploadAvatar = void 0;
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
// ── Avatar upload (client + mechanic) ──────────────────────────────
const avatarStorage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.default,
    params: async (_req, file) => ({
        folder: "mech-mate/avatars",
        resource_type: "image",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        transformation: [{ width: 400, height: 400, crop: "fill", gravity: "face" }],
        public_id: `avatar_${Date.now()}_${Math.round(Math.random() * 1e9)}`,
    }),
});
// ── ID proof upload (mechanic only) ────────────────────────────────
const idProofStorage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.default,
    params: async (_req, file) => ({
        folder: "mech-mate/id-proofs",
        resource_type: "image",
        allowed_formats: ["jpg", "jpeg", "png", "pdf", "webp"],
        public_id: `id_${Date.now()}_${Math.round(Math.random() * 1e9)}`,
    }),
});
const fileFilter = (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error("Only JPEG, PNG, WEBP images and PDF files are allowed"), false);
    }
};
exports.uploadAvatar = (0, multer_1.default)({ storage: avatarStorage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });
exports.uploadIdProof = (0, multer_1.default)({ storage: idProofStorage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });
