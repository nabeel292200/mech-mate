import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import "express-async-errors"; // auto-catches async errors → passes to errorHandler

import authRoutes from "./routes/auth.routes";
import { errorHandler, notFound } from "./middleware/error.middleware";

const app = express();

// ─── Security & Parsing ───────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
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
  res.json({ success: true, message: "ASSIST API is running", env: process.env.NODE_ENV });
});

// ─── Routes ──────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);

// ─── Error handling (must be last) ───────────────────────────────
app.use(notFound as any);
app.use(errorHandler as any);

export default app;
