import { Request, Response } from "express";
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


