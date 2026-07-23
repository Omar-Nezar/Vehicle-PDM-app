import express from "express";
import { addVehicle } from "../controllers/car.controller.js";
import { protect, carOwnerOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/addcar", protect, carOwnerOnly, addVehicle);

export default router;