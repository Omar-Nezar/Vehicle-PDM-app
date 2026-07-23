import { type Request, type Response } from "express";
import vehicleModel from "../models/vehicleModel.js";
import { type AuthRequest } from "../middleware/authMiddleware.js";

export const addVehicle = async (req: AuthRequest, res: Response) => {
    try {
        const { make, model, year, plateNumber, mileage, vin } = req.body;

        if (!make || !model || !year || !plateNumber || !mileage || !vin) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const vinExists = await vehicleModel.findOne({ vin })
        if (vinExists) {
            console.log("Vin!")
            return res.status(400).json({
                message: "Vehicle with this VIN already exists",
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
            mileage,
            vin
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