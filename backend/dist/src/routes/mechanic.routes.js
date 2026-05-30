"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const mechanic_controller_1 = require("../controllers/mechanic.controller");
const router = (0, express_1.Router)();
// All routes here require the user to be logged in and have the "mechanic" role
router.use(auth_middleware_1.protect);
router.use((0, auth_middleware_1.restrictTo)("mechanic"));
router.get("/requests/pending", mechanic_controller_1.getPendingRequests);
router.get("/requests/active", mechanic_controller_1.getActiveRequests);
router.get("/requests/completed", mechanic_controller_1.getCompletedJobs);
router.get("/requests/:id", mechanic_controller_1.getRequestById);
router.put("/requests/:id/invoice", mechanic_controller_1.sendInvoice);
router.get("/earnings", mechanic_controller_1.getEarnings);
router.put("/profile", mechanic_controller_1.updateProfile);
exports.default = router;
