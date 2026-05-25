"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = __importDefault(require("./src/app"));
const db_1 = __importDefault(require("./src/config/db"));
const migration_utils_1 = require("./src/utils/migration.utils");
const PORT = process.env.PORT || 4000;
const startServer = async () => {
    await (0, db_1.default)();
    await (0, migration_utils_1.migrateLegacyMechanics)();
    app_1.default.listen(PORT, () => {
        console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("🚗  MECH-MATE Backend (TypeScript)");
        console.log(`📡  Server  → http://localhost:${PORT}`);
        console.log(`🌱  Mode    → ${process.env.NODE_ENV}`);
        console.log(`🔑  OTP     → last 4 digits of phone (dev)`);
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    });
};
process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection:", err.message);
    process.exit(1);
});
startServer();
