import express from "express";

import {
    refresh,
    registerUser,
    verifyRegistration,
    loginUser,
    updateUser,
    logout,
    forgotPassword,
    resetPassword,
    changePassword,
} from "../controllers/auth.controller.js";
import { carOwnerOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Register
router.post("/register", registerUser);
router.get("/verifyregistration/:token", verifyRegistration);

router.post("/login", loginUser);
router.post("/update", protect, carOwnerOnly, updateUser);
router.post("/refresh", refresh);
router.post("/logout", protect, logout);

// Forgot Password
router.post("/forgotpassword", forgotPassword);
router.post("/resetpassword/:id/:token", resetPassword);
router.post("/changepassword", protect, changePassword);

export default router;