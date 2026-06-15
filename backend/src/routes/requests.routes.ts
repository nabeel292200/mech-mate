import { Router, Request, Response } from "express";
import ServiceRequest from "../models/ServiceRequest.model";
import User from "../models/User.model";
import Message from "../models/Message.model";

const router = Router();

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const request = await ServiceRequest.findById(req.params.id)
      .populate("userId", "name phone avatar")
      .populate("mechanicId");

    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    let mechanicUser: any = null;
    if (request.mechanicId) {
      mechanicUser = await User.findOne({ mechanic: (request.mechanicId as any)._id }).select("name avatar");
    }

    // Attach mechanic user data if available
    const responseData: any = request.toObject();
    if (mechanicUser) {
      responseData.mechanicUser = mechanicUser;
    }

    res.json({ success: true, data: responseData });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Process payment
router.post("/:id/pay", async (req: Request, res: Response) => {
  try {
    const { paymentMethod } = req.body;
    const request = await ServiceRequest.findById(req.params.id);
    
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
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get chat history for a request
router.get("/:id/chat", async (req: Request, res: Response) => {
  try {
    const messages = await Message.find({ requestId: req.params.id })
      .populate("senderId", "name avatar role")
      .sort({ createdAt: 1 });
      
    res.json({ success: true, data: messages });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
