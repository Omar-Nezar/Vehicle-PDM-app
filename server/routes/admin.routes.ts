import express from "express";

import {
    getUsers,
    deleteUser,
    getAuditLogs,
    getUserCars,
    getServiceHistory,
    getVehicles,
    deleteUserCar
} from "../controllers/admin.controller.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/getusers", protect, adminOnly, getUsers);
router.delete("/deluser/:id", protect, adminOnly, deleteUser);
router.get("/getlogs", protect, adminOnly, getAuditLogs);
router.get("/getUserCars/:userId", protect, adminOnly, getUserCars)
router.get("/getHistory", protect, adminOnly, getServiceHistory)
router.get("/getVehicles", protect, adminOnly, getVehicles)
router.delete("/deleteUserCar/:vid/:userId", protect, adminOnly, deleteUserCar)

export default router;