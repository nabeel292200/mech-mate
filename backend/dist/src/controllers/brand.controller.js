"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBrands = void 0;
const Brand_model_1 = __importDefault(require("../models/Brand.model"));
// Helper to send standard responses
const sendSuccess = (res, data, message = "") => {
    return res.status(200).json({ success: true, message, data });
};
const sendError = (res, message, statusCode = 400) => {
    return res.status(statusCode).json({ success: false, message });
};
// ─────────────────────────────────────────────────────────────────
//  GET /api/brands?category=car
// ─────────────────────────────────────────────────────────────────
const getBrands = async (req, res) => {
    try {
        const { category } = req.query;
        // Build query (filter by category if provided, otherwise fetch all)
        const query = { isActive: true };
        if (category) {
            // If asking for a specific category, we can also include universally applicable 'all' brands
            query.category = { $in: [category, "all"] };
        }
        const brands = await Brand_model_1.default.find(query).sort({ name: 1 }).select("-__v");
        return sendSuccess(res, { brands }, "Brands fetched successfully");
    }
    catch (error) {
        console.error("[BRAND] Fetch Error:", error);
        return sendError(res, "Failed to fetch brands", 500);
    }
};
exports.getBrands = getBrands;
