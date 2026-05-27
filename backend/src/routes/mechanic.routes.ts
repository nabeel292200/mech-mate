import { Router } from "express";
import { protect, restrictTo } from "../middleware/auth.middleware";
import {
  getPendingRequests,
  getActiveRequests,
  getCompletedJobs,
  getEarnings,
  updateProfile,
  getRequestById,
  sendInvoice
} from "../controllers/mechanic.controller";

const router = Router();

// All routes here require the user to be logged in and have the "mechanic" role
router.use(protect);
router.use(restrictTo("mechanic"));

router.get("/requests/pending", getPendingRequests);
router.get("/requests/active", getActiveRequests);
router.get("/requests/completed", getCompletedJobs);
router.get("/requests/:id", getRequestById);
router.put("/requests/:id/invoice", sendInvoice);
router.get("/earnings", getEarnings);
router.put("/profile", updateProfile);

export default router;
