"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ServiceRequest_model_1 = __importDefault(require("../models/ServiceRequest.model"));
const User_model_1 = __importDefault(require("../models/User.model"));
const router = (0, express_1.Router)();
router.get("/:id", async (req, res) => {
    try {
        const request = await ServiceRequest_model_1.default.findById(req.params.id)
            .populate("userId", "name phone avatar")
            .populate("mechanicId");
        if (!request) {
            return res.status(404).json({ success: false, message: "Request not found" });
        }
        let mechanicUser = null;
        if (request.mechanicId) {
            mechanicUser = await User_model_1.default.findOne({ mechanic: request.mechanicId._id }).select("name avatar");
        }
        // Attach mechanic user data if available
        const responseData = request.toObject();
        if (mechanicUser) {
            responseData.mechanicUser = mechanicUser;
        }
        res.json({ success: true, data: responseData });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
// Process payment
router.post("/:id/pay", async (req, res) => {
    try {
        const { paymentMethod } = req.body;
        const request = await ServiceRequest_model_1.default.findById(req.params.id);
        if (!request) {
            return res.status(404).json({ success: false, message: "Request not found" });
        }
        if (request.status !== "invoiced" && request.status !== "completed") {
            return res.status(400).json({ success: false, message: "Request not ready for payment" });
        }
        // Mark as paid
        request.status = "completed";
        request.paymentStatus = "completed";
        if (paymentMethod) {
            request.paymentMethod = paymentMethod;
        }
        await request.save();
        res.json({ success: true, data: request, message: "Payment processed successfully" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.default = router;
