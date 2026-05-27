import { Request, Response } from "express";
import ServiceRequest from "../models/ServiceRequest.model";
import Mechanic from "../models/Mechanic.model";
import User from "../models/User.model";
import mongoose from "mongoose";

// Get pending requests (new requests waiting for any mechanic)
export const getPendingRequests = async (req: Request, res: Response) => {
  try {
    const requests = await ServiceRequest.find({
      status: "pending"
    })
      .populate("userId", "name phone avatar")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: requests });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get active requests (accepted but not completed/cancelled)
export const getActiveRequests = async (req: Request, res: Response) => {
  try {
    const mechData: any = req.user?.mechanic;
    const mechanicId = mechData?._id || mechData;
    if (!mechanicId) {
      return res.status(403).json({ success: false, message: "Not authorized as mechanic" });
    }

    const requests = await ServiceRequest.find({
      mechanicId,
      status: "accepted"
    })
      .populate("userId", "name phone avatar")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: requests });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a specific request by ID
export const getRequestById = async (req: Request, res: Response) => {
  try {
    const mechData: any = req.user?.mechanic;
    const mechanicId = mechData?._id || mechData;
    if (!mechanicId) {
      return res.status(403).json({ success: false, message: "Not authorized as mechanic" });
    }

    const request = await ServiceRequest.findOne({
      _id: req.params.id,
      mechanicId
    }).populate("userId", "name phone avatar");

    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    res.json({ success: true, data: request });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Send invoice and update request status
export const sendInvoice = async (req: Request, res: Response) => {
  try {
    const mechData: any = req.user?.mechanic;
    const mechanicId = mechData?._id || mechData;
    if (!mechanicId) {
      return res.status(403).json({ success: false, message: "Not authorized as mechanic" });
    }

    const { totalAmount, invoiceItems } = req.body;

    const request = await ServiceRequest.findOneAndUpdate(
      { _id: req.params.id, mechanicId },
      { 
        totalAmount,
        invoiceItems,
        status: "completed" // Set to completed so it immediately shows up in completed jobs
      },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    res.json({ success: true, data: request });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get completed jobs
export const getCompletedJobs = async (req: Request, res: Response) => {
  try {
    const mechData: any = req.user?.mechanic;
    const mechanicId = mechData?._id || mechData;
    if (!mechanicId) {
      return res.status(403).json({ success: false, message: "Not authorized as mechanic" });
    }

    const requests = await ServiceRequest.find({
      mechanicId,
      status: "completed"
    })
      .populate("userId", "name phone")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: requests });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get earnings analytics
export const getEarnings = async (req: Request, res: Response) => {
  try {
    const mechData: any = req.user?.mechanic;
    const mechanicId = mechData?._id || mechData;
    if (!mechanicId) {
      return res.status(403).json({ success: false, message: "Not authorized as mechanic" });
    }

    const requests = await ServiceRequest.find({
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
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update profile
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const mechanicId = req.user?.mechanic;
    
    if (!userId || !mechanicId) {
      return res.status(403).json({ success: false, message: "Not authorized as mechanic" });
    }

    const { name, experience, workshopAddress, brandExpertise, vehicleSkills } = req.body;

    if (name) {
      await User.findByIdAndUpdate(userId, { name });
    }

    const updatedMechanic = await Mechanic.findByIdAndUpdate(
      mechanicId,
      { experience, workshopAddress, brandExpertise, vehicleSkills },
      { new: true }
    );

    res.json({ success: true, data: updatedMechanic });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
