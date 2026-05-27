import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";

// ── Avatar upload (client + mechanic) ──────────────────────────────
const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: async (_req: any, file: any) => ({
    folder: "mech-mate/avatars",
    resource_type: "image",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 400, height: 400, crop: "fill", gravity: "face" }],
    public_id: `avatar_${Date.now()}_${Math.round(Math.random() * 1e9)}`,
  }),
});

// ── ID proof upload (mechanic only) ────────────────────────────────
const idProofStorage = new CloudinaryStorage({
  cloudinary,
  params: async (_req: any, file: any) => ({
    folder: "mech-mate/id-proofs",
    resource_type: "image",
    allowed_formats: ["jpg", "jpeg", "png", "pdf", "webp"],
    public_id: `id_${Date.now()}_${Math.round(Math.random() * 1e9)}`,
  }),
});

const fileFilter = (_req: any, file: any, cb: any) => {
  const allowed = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, WEBP images and PDF files are allowed"), false);
  }
};

export const uploadAvatar  = multer({ storage: avatarStorage,  fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });
export const uploadIdProof = multer({ storage: idProofStorage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });
