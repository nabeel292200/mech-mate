import { Request, Response } from "express";
import Brand from "../models/Brand.model";

// Helper to send standard responses
const sendSuccess = (res: Response, data: any, message = "") => {
  return res.status(200).json({ success: true, message, data });
};

const sendError = (res: Response, message: string, statusCode = 400) => {
  return res.status(statusCode).json({ success: false, message });
};

// ─────────────────────────────────────────────────────────────────
//  GET /api/brands?category=car
// ─────────────────────────────────────────────────────────────────
export const getBrands = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { category } = req.query;
    
    // Build query (filter by category if provided, otherwise fetch all)
    const query: any = { isActive: true };
    if (category) {
      // If asking for a specific category, we can also include universally applicable 'all' brands
      query.category = { $in: [category as string, "all"] };
    }

    const brands = await Brand.find(query).sort({ name: 1 }).select("-__v");
    return sendSuccess(res, { brands }, "Brands fetched successfully");
  } catch (error: any) {
    console.error("[BRAND] Fetch Error:", error);
    return sendError(res, "Failed to fetch brands", 500);
  }
};
