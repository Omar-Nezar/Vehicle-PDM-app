import express from "express";
import { addCar, getCars, deleteCar, getCarByVid, /* updateCar */ } from "../controllers/vehicle.controller.js";
import { protect, carOwnerOnly, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/addcar/:vid", protect, carOwnerOnly, addCar);
router.get("/getCars", protect, carOwnerOnly, getCars)
router.get("/getCarDetails/:vid", protect, getCarByVid);
router.delete("/deletecar/:vid", protect, carOwnerOnly, deleteCar)
// router.put("/updatecar/:id", protect, carOwnerOnly, updateCar);

export default router;