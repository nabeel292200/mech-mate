"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
require("express-async-errors"); // auto-catches async errors → passes to errorHandler
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const brand_routes_1 = __importDefault(require("./routes/brand.routes"));
const error_middleware_1 = require("./middleware/error.middleware");
const app = (0, express_1.default)();
// ─── Security & Parsing ───────────────────────────────────────────
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
    credentials: true,
}));
app.use(express_1.default.json({ limit: "10kb" }));
app.use(express_1.default.urlencoded({ extended: true }));
// ─── Logging (dev only) ───────────────────────────────────────────
if (process.env.NODE_ENV !== "production") {
    app.use((0, morgan_1.default)("dev"));
}
// ─── Health check ────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
    res.json({ success: true, message: "MECH-MATE API is running", env: process.env.NODE_ENV });
});
// ─── Routes ──────────────────────────────────────────────────────
app.use("/api/auth", auth_routes_1.default);
app.use("/api/brands", brand_routes_1.default);
// ─── Error handling (must be last) ───────────────────────────────
app.use(error_middleware_1.notFound);
app.use(error_middleware_1.errorHandler);
exports.default = app;
