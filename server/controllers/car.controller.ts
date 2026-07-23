import { type Request, type Response } from "express";
import vehicleModel from "../models/vehicleModel.js";
import { type AuthRequest } from "../middleware/authMiddleware.js";

export const addVehicle = async (req: AuthRequest, res: Response) => {
    try {
        const { make, model, year, plateNumber, mileage } = req.body;

        if (!make || !model || !year || !plateNumber || !mileage) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const plateExists = await vehicleModel.findOne({ plateNumber })
        if (plateExists) {
            return res.status(400).json({
                message: "Vehicle with this plate already exists",
            });
        }

        // req.user comes from protect middleware
        const user = req.user._id;

        const vehicle = await vehicleModel.create({
            owner: user,
            make,
            model,
            year,
            plateNumber,
            mileage
        });

        return res.status(201).json({
            message: "Vehicle added successfully",
            vehicle,
        });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};