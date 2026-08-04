import express from "express";

import { getUsers, deleteUser, getAuditLogs } from "../controllers/user.controller.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/getusers", protect, adminOnly, getUsers);
router.delete("/deluser/:id", protect, adminOnly, deleteUser);
router.get("/getlogs", protect, adminOnly, getAuditLogs);

export default router;