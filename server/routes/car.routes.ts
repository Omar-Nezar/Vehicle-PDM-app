import express from "express";
import {
    addCar,
    getCars,
    deleteCar,
    getCarByVid,
    getCarsSurvival,
    getCarsSurvivalTest,
    getProjections,
    /* updateCar */
} from "../controllers/vehicle.controller.js";
import { protect, carOwnerOnly, inventoryManagerOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/addcar/:vid", protect, carOwnerOnly, addCar);
router.get("/getCars", protect, carOwnerOnly, getCars);
router.get("/getCarDetails/:vid", protect, getCarByVid);
router.get("/getCarsSurvival", protect, carOwnerOnly, getCarsSurvival);
router.get("/getCarsSurvivalTest/:_id", getCarsSurvivalTest);
router.get("/getProjections", protect, inventoryManagerOnly, getProjections);
router.delete("/deletecar/:vid", protect, carOwnerOnly, deleteCar)
// router.put("/updatecar/:id", protect, carOwnerOnly, updateCar);

export default router;