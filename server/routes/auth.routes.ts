import express from "express";

import {
    refresh,
    registerUser,
    loginUser,
    updateUser,
    logout,
    forgotPassword,
    resetPassword,
    changePassword,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/update", updateUser);
router.post("/refresh", refresh);
router.post("/logout", protect, logout);

// Forgot Password
router.post("/forgotpassword", forgotPassword);
router.post("/resetpassword/:id/:token", resetPassword);
router.post("/changepassword", protect, changePassword);

export default router;