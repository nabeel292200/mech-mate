import { Request, Response } from "express";
import Skill from "../models/Skill.model";

export const getActiveSkills = async (_req: Request, res: Response) => {
  try {
    const skills = await Skill.find({ isActive: true }).sort({ category: 1, name: 1 });
    res.json({ success: true, data: { skills } });
  } catch (error: any) {
    console.error("Failed to fetch active skills:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
