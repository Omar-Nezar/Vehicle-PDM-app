import express from "express";

import {
    getUsers,
    deleteUser,
    getAuditLogs,
    getUserCars,
    getServiceHistory,
    getVehicles,
} from "../controllers/admin.controller.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/getusers", protect, adminOnly, getUsers);
router.delete("/deluser/:id", protect, adminOnly, deleteUser);
router.get("/getlogs", protect, adminOnly, getAuditLogs);
router.get("/getUserCars/:userId", protect, adminOnly, getUserCars)
router.get("/getHistory", protect, adminOnly, getServiceHistory)
router.get("/getVehicles", protect, adminOnly, getVehicles)

export default router;