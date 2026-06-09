import { Router } from "express";
import { getActiveSkills } from "../controllers/skill.controller";

const router = Router();

router.get("/", getActiveSkills);

export default router;
