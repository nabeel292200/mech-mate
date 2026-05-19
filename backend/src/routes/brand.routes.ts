import express from "express";
import { getBrands } from "../controllers/brand.controller";

const router = express.Router();

// Public route to get active brands
router.get("/", getBrands as any);

export default router;
