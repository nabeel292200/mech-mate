import { Request, Response } from "express";
import Skill from "../models/Skill.model";
import Brand from "../models/Brand.model";

// --- Brands Management ---

export const getBrands = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const total = await Brand.countDocuments();
    const brands = await Brand.find()
      .sort({ category: 1, name: 1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      data: {
        items: brands,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

export const createBrand = async (req: Request, res: Response) => {
  try {
    const { name, category, logoUrl, isActive } = req.body;
    const newBrand = await Brand.create({ name, category, logoUrl, isActive });
    res.json({ success: true, message: "Brand created", data: newBrand });
  } catch (error: any) {
    if (error.code === 11000) return res.status(400).json({ success: false, message: "Brand already exists in this category" });
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

export const updateBrand = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, category, logoUrl, isActive } = req.body;
    const brand = await Brand.findByIdAndUpdate(id, { name, category, logoUrl, isActive }, { new: true });
    if (!brand) return res.status(404).json({ success: false, message: "Brand not found" });
    res.json({ success: true, message: "Brand updated", data: brand });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

export const deleteBrand = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const brand = await Brand.findByIdAndDelete(id);
    if (!brand) return res.status(404).json({ success: false, message: "Brand not found" });
    res.json({ success: true, message: "Brand deleted" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// --- Skills Management ---

export const getSkills = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const total = await Skill.countDocuments();
    const skills = await Skill.find()
      .sort({ category: 1, name: 1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      data: {
        items: skills,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

export const createSkill = async (req: Request, res: Response) => {
  try {
    const { name, category, isActive } = req.body;
    const newSkill = await Skill.create({ name, category, isActive });
    res.json({ success: true, message: "Skill created", data: newSkill });
  } catch (error: any) {
    console.error("Error creating skill:", error);
    if (error.code === 11000) return res.status(400).json({ success: false, message: "Skill already exists in this category" });
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

export const updateSkill = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, category, isActive } = req.body;
    const skill = await Skill.findByIdAndUpdate(id, { name, category, isActive }, { new: true });
    if (!skill) return res.status(404).json({ success: false, message: "Skill not found" });
    res.json({ success: true, message: "Skill updated", data: skill });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

export const deleteSkill = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const skill = await Skill.findByIdAndDelete(id);
    if (!skill) return res.status(404).json({ success: false, message: "Skill not found" });
    res.json({ success: true, message: "Skill deleted" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
