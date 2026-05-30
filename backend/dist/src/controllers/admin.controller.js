"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = void 0;
const User_model_1 = __importDefault(require("../models/User.model"));
const ServiceRequest_model_1 = __importDefault(require("../models/ServiceRequest.model"));
const getDashboardStats = async (req, res) => {
    try {
        // KPIs
        const totalUsers = await User_model_1.default.countDocuments({ role: "user" });
        const totalMechanics = await User_model_1.default.countDocuments({ role: "mechanic" });
        const activeRequests = await ServiceRequest_model_1.default.countDocuments({
            status: { $in: ["pending", "accepted", "invoiced"] },
        });
        const completedServices = await ServiceRequest_model_1.default.countDocuments({
            status: "completed",
        });
        // Request Volume (Last 7 Days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);
        const volumeData = await ServiceRequest_model_1.default.aggregate([
            { $match: { createdAt: { $gte: sevenDaysAgo } } },
            {
                $group: {
                    _id: { $dayOfWeek: "$createdAt" },
                    count: { $sum: 1 },
                },
            },
        ]);
        // Map 1=Sun, 2=Mon... to standard labels
        const daysMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const requestVolume = daysMap.map((day, index) => {
            // MongoDB $dayOfWeek returns 1 for Sunday, 7 for Saturday
            const found = volumeData.find((d) => d._id === index + 1);
            return {
                day,
                count: found ? found.count : 0,
            };
        });
        // Service Distribution
        const distributionData = await ServiceRequest_model_1.default.aggregate([
            {
                $group: {
                    _id: "$problemDetails",
                    count: { $sum: 1 },
                },
            },
            { $sort: { count: -1 } },
            { $limit: 4 }, // Top 4 categories
        ]);
        const totalServiceCount = await ServiceRequest_model_1.default.countDocuments();
        const serviceDistribution = distributionData.map((d) => ({
            label: d._id || "Other",
            percent: totalServiceCount ? Math.round((d.count / totalServiceCount) * 100) : 0,
        }));
        // Pending Technician Approvals
        // Fetch mechanics who are inactive but have completed profiles
        const pendingMechanics = await User_model_1.default.find({
            role: "mechanic",
            isActive: false,
            isProfileComplete: true,
        })
            .populate("mechanic") // to get experience, skills, etc.
            .sort({ createdAt: -1 })
            .limit(10);
        const formattedPendingMechanics = pendingMechanics.map((m) => ({
            _id: m._id,
            name: m.name || m.phone,
            email: m.phone + "@example.com", // Dummy email since phone is used
            experience: m.mechanic?.experience ? `${m.mechanic.experience} Years` : "N/A",
            specialization: m.mechanic?.vehicleSkills?.join(", ") || "General",
            submitted: m.createdAt,
            status: "PENDING",
            initials: m.name ? m.name.substring(0, 2).toUpperCase() : "M",
            bg: "#ef4444", // random color could be added here
        }));
        res.json({
            success: true,
            data: {
                kpis: {
                    totalUsers,
                    totalMechanics,
                    activeRequests,
                    completedServices,
                },
                requestVolume,
                serviceDistribution,
                pendingApprovals: formattedPendingMechanics,
            },
        });
    }
    catch (error) {
        console.error("Dashboard Stats Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
exports.getDashboardStats = getDashboardStats;
