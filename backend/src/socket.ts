import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";

export const initSocket = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    cors: { origin: "*", methods: ["GET", "POST"] }
  });

  // Track connected mechanics: socketId -> mechanic info
  const connectedMechanics = new Map<string, { mechanicId: string, brandExpertise: string[] }>();

  io.on("connection", (socket: Socket) => {
    console.log(`Socket Connected: ${socket.id}`);

    // Mechanics register their active presence
    socket.on("register_mechanic", async (data: { mechanicId: string }) => {
      try {
        const Mechanic = require("./models/Mechanic.model").default;
        const mechanic = await Mechanic.findById(data.mechanicId);
        if (mechanic) {
          connectedMechanics.set(socket.id, {
            mechanicId: data.mechanicId,
            brandExpertise: mechanic.brandExpertise || []
          });
          console.log(`Mechanic registered: ${data.mechanicId} / Socket: ${socket.id}`);
        }
      } catch (err) {
        console.error("Mechanic socket registration error:", err);
      }
    });

    socket.on("create_request", async (data: { userId: string, brandName: string, problemDetails: string, userLocation: any }) => {
      try {
        const ServiceRequest = require("./models/ServiceRequest.model").default;

        const newReq = await ServiceRequest.create({
          userId: data.userId,
          brandName: data.brandName,
          problemDetails: data.problemDetails,
          userLocation: data.userLocation,
          status: "pending"
        });

        await newReq.populate("userId", "name phone avatar");

        let mechanicsNotified = 0;

        for (const [socketId, mechanicInfo] of connectedMechanics.entries()) {
          const isExpert = mechanicInfo.brandExpertise?.some(b => {
            if (!b || !data.brandName) return false;
            const mechB = b.toLowerCase();
            const reqB = data.brandName.toLowerCase();
            return mechB === reqB || mechB.includes(reqB) || reqB.includes(mechB);
          });

          if (isExpert) {
            io.to(socketId).emit("new_request", newReq);
            mechanicsNotified++;
          }
        }

        socket.emit("request_created", { request: newReq, mechanicsNotified });

      } catch (error: any) {
        console.error("Error creating request:", error);
        socket.emit("request_error", { message: "Failed to create request" });
      }
    });

    socket.on("accept_request", async (data: { requestId: string, mechanicId: string }) => {
      try {
        const ServiceRequest = require("./models/ServiceRequest.model").default;
        const updatedReq = await ServiceRequest.findByIdAndUpdate(
          data.requestId,
          { mechanicId: data.mechanicId, status: "accepted" },
          { new: true }
        );

        io.emit("request_accepted", updatedReq);
      } catch (error: any) {
        console.error("Error accepting request:", error);
        socket.emit("request_error", { message: "Failed to accept request" });
      }
    });

    socket.on("reject_request", async (data: { requestId: string, mechanicId: string }) => {
      try {
        const ServiceRequest = require("./models/ServiceRequest.model").default;
        await ServiceRequest.findByIdAndUpdate(
          data.requestId,
          { status: "cancelled" },
          { new: true }
        );
        io.emit("request_rejected", { requestId: data.requestId });
      } catch (error: any) {
        console.error("Error rejecting request:", error);
      }
    });

    socket.on("location_update", (data: { requestId: string, role: string, location: any }) => {
      io.emit("location_update", data);
    });

    socket.on("mechanic_arrived", (data: { requestId: string }) => {
      io.emit("mechanic_arrived", data);
    });

    socket.on("send_invoice", (data: { requestId: string }) => {
      io.emit("invoice_received", data);
    });

    socket.on("payment_completed", (data: { requestId: string }) => {
      io.emit("payment_completed", data);
    });

    socket.on("disconnect", () => {
      connectedMechanics.delete(socket.id);
      console.log(`Socket Disconnected: ${socket.id}`);
    });
  });
};
