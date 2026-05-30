"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getEarnings = exports.getCompletedJobs = exports.sendInvoice = exports.getRequestById = exports.getActiveRequests = exports.getPendingRequests = void 0;
const ServiceRequest_model_1 = __importDefault(require("../models/ServiceRequest.model"));
const Mechanic_model_1 = __importDefault(require("../models/Mechanic.model"));
const User_model_1 = __importDefault(require("../models/User.model"));
// Get pending requests (new requests waiting for any mechanic)
const getPendingRequests = async (req, res) => {
    try {
        const requests = await ServiceRequest_model_1.default.find({
            status: "pending"
        })
            .populate("userId", "name phone avatar")
            .sort({ createdAt: -1 });
        res.json({ success: true, data: requests });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getPendingRequests = getPendingRequests;
// Get active requests (accepted but not completed/cancelled)
const getActiveRequests = async (req, res) => {
    try {
        const mechData = req.user?.mechanic;
        const mechanicId = mechData?._id || mechData;
        if (!mechanicId) {
            return res.status(403).json({ success: false, message: "Not authorized as mechanic" });
        }
        const requests = await ServiceRequest_model_1.default.find({
            mechanicId,
            status: "accepted"
        })
            .populate("userId", "name phone avatar")
            .sort({ createdAt: -1 });
        res.json({ success: true, data: requests });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getActiveRequests = getActiveRequests;
// Get a specific request by ID
const getRequestById = async (req, res) => {
    try {
        const mechData = req.user?.mechanic;
        const mechanicId = mechData?._id || mechData;
        if (!mechanicId) {
            return res.status(403).json({ success: false, message: "Not authorized as mechanic" });
        }
        const request = await ServiceRequest_model_1.default.findOne({
            _id: req.params.id,
            mechanicId
        }).populate("userId", "name phone avatar");
        if (!request) {
            return res.status(404).json({ success: false, message: "Request not found" });
        }
        res.json({ success: true, data: request });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getRequestById = getRequestById;
// Send invoice and update request status
const sendInvoice = async (req, res) => {
    try {
        const mechData = req.user?.mechanic;
        const mechanicId = mechData?._id || mechData;
        if (!mechanicId) {
            return res.status(403).json({ success: false, message: "Not authorized as mechanic" });
        }
        const { totalAmount, invoiceItems } = req.body;
        const request = await ServiceRequest_model_1.default.findOneAndUpdate({ _id: req.params.id, mechanicId }, {
            totalAmount,
            invoiceItems,
            status: "completed" // Set to completed so it immediately shows up in completed jobs
        }, { new: true });
        if (!request) {
            return res.status(404).json({ success: false, message: "Request not found" });
        }
        res.json({ success: true, data: request });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.sendInvoice = sendInvoice;
// Get completed jobs
const getCompletedJobs = async (req, res) => {
    try {
        const mechData = req.user?.mechanic;
        const mechanicId = mechData?._id || mechData;
        if (!mechanicId) {
            return res.status(403).json({ success: false, message: "Not authorized as mechanic" });
        }
        const requests = await ServiceRequest_model_1.default.find({
            mechanicId,
            status: "completed"
        })
            .populate("userId", "name phone")
            .sort({ createdAt: -1 });
        res.json({ success: true, data: requests });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getCompletedJobs = getCompletedJobs;
// Get earnings analytics
const getEarnings = async (req, res) => {
    try {
        const mechData = req.user?.mechanic;
        const mechanicId = mechData?._id || mechData;
        if (!mechanicId) {
            return res.status(403).json({ success: false, message: "Not authorized as mechanic" });
        }
        const requests = await ServiceRequest_model_1.default.find({
            mechanicId,
            status: "completed"
        }).sort({ createdAt: -1 });
        let totalEarnings = 0;
        let thisWeekEarnings = 0;
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        requests.forEach(req => {
            const amount = req.totalAmount || 0;
            totalEarnings += amount;
            if (req.createdAt && new Date(req.createdAt) > oneWeekAgo) {
                thisWeekEarnings += amount;
            }
        });
        res.json({
            success: true,
            data: {
                totalEarnings,
                thisWeekEarnings,
                totalJobs: requests.length,
                recentTransactions: requests.slice(0, 10).map(r => ({
                    id: r._id,
                    amount: r.totalAmount || 0,
                    date: r.createdAt,
                    brandName: r.brandName
                }))
            }
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getEarnings = getEarnings;
// Update profile
const updateProfile = async (req, res) => {
    try {
        const userId = req.user?._id;
        const mechanicId = req.user?.mechanic;
        if (!userId || !mechanicId) {
            return res.status(403).json({ success: false, message: "Not authorized as mechanic" });
        }
        const { name, experience, workshopAddress, brandExpertise, vehicleSkills } = req.body;
        if (name) {
            await User_model_1.default.findByIdAndUpdate(userId, { name });
        }
        const updatedMechanic = await Mechanic_model_1.default.findByIdAndUpdate(mechanicId, { experience, workshopAddress, brandExpertise, vehicleSkills }, { new: true });
        res.json({ success: true, data: updatedMechanic });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateProfile = updateProfile;
