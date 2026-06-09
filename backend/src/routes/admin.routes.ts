import { Router } from "express";
import { getDashboardStats, getAllMechanics, updateMechanicStatus, getAllUsers, updateUserStatus, getHistory, getPaymentsOverview } from "../controllers/admin.controller";
import { getSkills, createSkill, updateSkill, deleteSkill, getBrands, createBrand, updateBrand, deleteBrand } from "../controllers/cms.controller";

const router = Router();

// Dashboard routes
router.get("/dashboard-stats", getDashboardStats);

// Mechanics routes
router.get("/mechanics", getAllMechanics);
router.put("/mechanics/:id/status", updateMechanicStatus);

// Users routes
router.get("/users", getAllUsers);
router.put("/users/:id/status", updateUserStatus);

// History & Payments routes
router.get("/history", getHistory);
router.get("/payments", getPaymentsOverview);

// CMS - Skills routes
router.get("/skills", getSkills);
router.post("/skills", createSkill);
router.put("/skills/:id", updateSkill);
router.delete("/skills/:id", deleteSkill);

// CMS - Brands routes
router.get("/brands", getBrands);
router.post("/brands", createBrand);
router.put("/brands/:id", updateBrand);
router.delete("/brands/:id", deleteBrand);

export default router;
