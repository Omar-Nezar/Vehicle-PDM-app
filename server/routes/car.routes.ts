import express from "express";
import { addCar, getCars, deleteCar, updateCar } from "../controllers/car.controller.js";
import { protect, carOwnerOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/addcar", protect, carOwnerOnly, addCar);
router.get("/getUserCars", protect, carOwnerOnly, getCars)
router.delete("/deletecar/:id", protect, carOwnerOnly, deleteCar)
router.put("/updatecar/:id", protect, carOwnerOnly, updateCar);

export default router;