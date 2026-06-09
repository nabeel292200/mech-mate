import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import "express-async-errors"; // auto-catches async errors → passes to errorHandler

import authRoutes from "./routes/auth.routes";
import brandRoutes from "./routes/brand.routes";
import skillRoutes from "./routes/skill.routes";
import mechanicRoutes from "./routes/mechanic.routes";
import requestRoutes from "./routes/requests.routes";
import uploadRoutes from "./routes/upload.routes";
import adminRoutes from "./routes/admin.routes";
import { errorHandler, notFound } from "./middleware/error.middleware";

const app = express();

// ─── Security & Parsing ───────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
    credentials: true,
  })
);
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

// ─── Logging (dev only) ───────────────────────────────────────────
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// ─── Health check ────────────────────────────────────────────────
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ success: true, message: "MECH-MATE API is running", env: process.env.NODE_ENV });
});

// ─── Routes ──────────────────────────────────────────────────────
app.use("/api/auth",     authRoutes);
app.use("/api/brands",   brandRoutes);
app.use("/api/skills",   skillRoutes);
app.use("/api/mechanic", mechanicRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/upload",   uploadRoutes);
app.use("/api/admin",    adminRoutes);

// ─── Error handling (must be last) ───────────────────────────────
app.use(notFound as any);
app.use(errorHandler as any);

export default app;
