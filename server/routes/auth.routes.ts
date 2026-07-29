import express from "express";

import { refresh, registerUser, loginUser, updateUser, logout } from "../controllers/auth.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/update", updateUser);
router.post("/refresh", refresh);
router.post("/logout", protect, logout);

export default router;