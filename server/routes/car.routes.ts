import express from "express";
import { addVehicle, getVehicles, deleteVehicle } from "../controllers/car.controller.js";
import { protect, carOwnerOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/addcar", protect, carOwnerOnly, addVehicle);
router.get("/getUserCars", protect, carOwnerOnly, getVehicles)
router.delete("/deletecar/:id", protect, carOwnerOnly, deleteVehicle )

export default router;