import { Request, Response } from "express";
import User from "../models/User.model";
import ServiceRequest from "../models/ServiceRequest.model";

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    // KPIs
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalMechanics = await User.countDocuments({ role: "mechanic" });
    const activeRequests = await ServiceRequest.countDocuments({
      status: { $in: ["pending", "accepted", "invoiced"] },
    });
    const completedServices = await ServiceRequest.countDocuments({
      status: "completed",
    });

    // Request Volume (Last 7 Days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const volumeData = await ServiceRequest.aggregate([
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
    const distributionData = await ServiceRequest.aggregate([
      {
        $group: {
          _id: "$problemDetails",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 4 }, // Top 4 categories
    ]);

    const totalServiceCount = await ServiceRequest.countDocuments();
    const serviceDistribution = distributionData.map((d) => ({
      label: d._id || "Other",
      percent: totalServiceCount ? Math.round((d.count / totalServiceCount) * 100) : 0,
    }));

    // Pending Technician Approvals
    // Fetch mechanics who are inactive but have completed profiles
    const pendingMechanics = await User.find({
      role: "mechanic",
      approvalStatus: "pending",
      isProfileComplete: true,
    })
      .populate("mechanic") // to get experience, skills, etc.
      .sort({ createdAt: -1 })
      .limit(10);

    const formattedPendingMechanics = pendingMechanics.map((m: any) => ({
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
  } catch (error: any) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message, stack: error.stack });
  }
};

export const getAllMechanics = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const total = await User.countDocuments({ role: "mechanic" });
    const mechanics = await User.find({ role: "mechanic" })
      .populate("mechanic")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const formattedMechanics = mechanics.map((m: any) => ({
      _id: m._id,
      name: m.name || m.phone,
      phone: m.phone,
      email: m.email || "N/A",
      experience: m.mechanic?.experience ? `${m.mechanic.experience} Years` : "N/A",
      specialization: m.mechanic?.vehicleSkills?.join(", ") || "General",
      brandExpertise: m.mechanic?.brandExpertise || [],
      workshopName: m.mechanic?.workshopAddress || "Not specified",
      location: { address: m.mechanic?.workshopAddress || "Location not provided" },
      rating: m.mechanic?.rating || 0,
      totalJobs: m.mechanic?.totalJobs || 0,
      documents: m.mechanic?.idProofUrl ? [m.mechanic.idProofUrl] : [],
      approvalStatus: m.approvalStatus,
      isActive: m.isActive,
      isProfileComplete: m.isProfileComplete,
      submitted: m.createdAt,
      initials: m.name ? m.name.substring(0, 2).toUpperCase() : "M",
    }));

    res.json({
      success: true,
      data: {
        items: formattedMechanics,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    });
  } catch (error: any) {
    console.error("Get All Mechanics Error:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

export const updateMechanicStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { approvalStatus, isActive } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "Mechanic not found" });
    }

    if (user.role !== "mechanic") {
      return res.status(400).json({ success: false, message: "User is not a mechanic" });
    }

    if (approvalStatus !== undefined) {
      if (!["pending", "approved", "rejected"].includes(approvalStatus)) {
        return res.status(400).json({ success: false, message: "Invalid approvalStatus" });
      }
      user.approvalStatus = approvalStatus;
    }

    if (isActive !== undefined) {
      user.isActive = Boolean(isActive);
    }

    await user.save();

    res.json({ success: true, message: "Mechanic status updated successfully", data: user });
  } catch (error: any) {
    console.error("Update Mechanic Status Error:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const total = await User.countDocuments({ role: "user" });
    const users = await User.find({ role: "user" })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const formattedUsers = users.map((u: any) => ({
      _id: u._id,
      name: u.name || "N/A",
      phone: u.phone,
      isActive: u.isActive,
      joined: u.createdAt,
      initials: u.name ? u.name.substring(0, 2).toUpperCase() : "U",
    }));

    res.json({
      success: true,
      data: {
        items: formattedUsers,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    });
  } catch (error: any) {
    console.error("Get All Users Error:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

export const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.role !== "user") {
      return res.status(400).json({ success: false, message: "Not a regular user" });
    }

    if (isActive !== undefined) {
      user.isActive = Boolean(isActive);
    }

    await user.save();

    res.json({ success: true, message: "User status updated successfully", data: user });
  } catch (error: any) {
    console.error("Update User Status Error:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

export const getHistory = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const total = await ServiceRequest.countDocuments();
    const requests = await ServiceRequest.find()
      .populate("userId", "name phone")
      .populate("mechanicId", "name phone")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const formattedHistory = requests.map((r: any) => ({
      id: r._id.toString().slice(-6).toUpperCase(), // Short ID
      _id: r._id,
      date: r.createdAt.toISOString().split("T")[0],
      user: r.userId?.name || r.userId?.phone || "Unknown User",
      mechanic: r.mechanicId?.name || r.mechanicId?.phone || "Unassigned",
      status: r.status.charAt(0).toUpperCase() + r.status.slice(1),
      amount: `$${(r.totalAmount || 0).toFixed(2)}`,
    }));

    res.json({
      success: true,
      data: {
        items: formattedHistory,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    });
  } catch (error: any) {
    console.error("Get History Error:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

export const getPaymentsOverview = async (req: Request, res: Response) => {
  try {
    // Basic aggregation for payments overview
    const completedRequests = await ServiceRequest.find({ status: "completed" });
    
    let totalRevenue = 0;
    completedRequests.forEach(req => {
      totalRevenue += (req.totalAmount || 0);
    });

    const platformFees = totalRevenue * 0.15; // 15% platform fee
    const pendingPayouts = totalRevenue - platformFees;

    // Fetch recent transactions (any request with totalAmount > 0 and invoiced/completed)
    const recentTransactionsData = await ServiceRequest.find({
      totalAmount: { $gt: 0 },
      status: { $in: ["invoiced", "completed"] }
    })
      .populate("mechanicId", "name phone")
      .sort({ updatedAt: -1 })
      .limit(20);

    const recentTransactions = recentTransactionsData.map((r: any) => ({
      id: r._id.toString().slice(-6).toUpperCase(),
      date: r.updatedAt.toISOString().split("T")[0],
      mechanic: r.mechanicId?.name || r.mechanicId?.phone || "Unknown Mechanic",
      amount: `$${(r.totalAmount || 0).toFixed(2)}`,
      paymentStatus: r.paymentStatus === "completed" ? "Completed" : "Pending",
    }));

    res.json({
      success: true,
      data: {
        totalRevenue,
        pendingPayouts,
        platformFees,
        recentTransactions,
      }
    });
  } catch (error: any) {
    console.error("Get Payments Error:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
