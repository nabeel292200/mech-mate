import { Router, Request, Response } from "express";
import { protect } from "../middleware/auth.middleware";
import { uploadAvatar, uploadIdProof } from "../middleware/upload.middleware";
import User from "../models/User.model";
import Mechanic from "../models/Mechanic.model";
import { AuthenticatedRequest } from "../middleware/auth.middleware";

const router = Router();

// ── POST /api/upload/avatar  (any authenticated user) ──────────────
// Saves the Cloudinary URL to user.avatar in MongoDB
router.post(
  "/avatar",
  protect as any,
  uploadAvatar.single("avatar"),
  async (req: Request, res: Response) => {
    try {
      const user = (req as AuthenticatedRequest).user;
      if (!user) return res.status(401).json({ success: false, message: "Unauthorized" });

      const file = req.file as Express.Multer.File & { path: string };
      if (!file) return res.status(400).json({ success: false, message: "No file uploaded" });

      // Attach URL directly to user document
      await User.findByIdAndUpdate(user._id, { avatar: (file as any).path });

      return res.json({
        success: true,
        message: "Avatar uploaded successfully",
        data: { avatarUrl: (file as any).path },
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }
);

// ── POST /api/upload/id-proof  (mechanic only) ─────────────────────
// Saves the Cloudinary URL to mechanic.idProofUrl in MongoDB
router.post(
  "/id-proof",
  protect as any,
  uploadIdProof.single("idProof"),
  async (req: Request, res: Response) => {
    try {
      const user = (req as AuthenticatedRequest).user;
      if (!user) return res.status(401).json({ success: false, message: "Unauthorized" });
      if (user.role !== "mechanic")
        return res.status(403).json({ success: false, message: "Only mechanics can upload ID proof" });

      const file = req.file as Express.Multer.File & { path: string };
      if (!file) return res.status(400).json({ success: false, message: "No file uploaded" });

      // Attach URL to mechanic document
      await Mechanic.findByIdAndUpdate(user.mechanic, { idProofUrl: (file as any).path });

      return res.json({
        success: true,
        message: "ID proof uploaded successfully",
        data: { idProofUrl: (file as any).path },
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }
);

export default router;
