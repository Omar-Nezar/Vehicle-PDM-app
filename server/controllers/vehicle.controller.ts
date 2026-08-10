import { type Request, type Response } from "express";
import { type AuthRequest } from "../middleware/authMiddleware.js";
import vehicleRegistryModel from "../models/vehicleRegistryModel.js";
import vehicleModel from "../models/vehicleModel.js";

export const addCar = async (req: AuthRequest, res: Response) => {
    try {
        const { vid } = req.body;

        if (!vid) {
            return res.status(400).json({
                message: "VID is required",
            });
        }

        const exists = await vehicleModel.findOne({ vid });
        if (!exists) {
            return res.status(400).json({
                message: "Invalid VID",
            });
        }

        const userId = req.user._id;

        // Create registry if it doesn't exist, otherwise add VID
        const registry = await vehicleRegistryModel.findOneAndUpdate(
            { owner: userId },
            {
                $addToSet: { vehicles: vid }, // prevents duplicates
            },
            {
                returnDocument: "after",
                upsert: true, // creates document if not exists
            }
        );

        return res.status(200).json({
            message: "Car added successfully",
            registry,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error",
        });
    }
};

export const getCars = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user._id;

        const registry = await vehicleRegistryModel.findOne({ owner: userId });

        return res.status(200).json({
            message: "Cars fetched successfully",
            cars: registry?.vehicles || [],
        });
    } catch (err) {
        return res.status(500).json({
            message: "Failed to fetch vehicles",
        });
    }
};

export const deleteCar = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user._id;
        const { vid } = req.params;

        if (!vid) {
            return res.status(400).json({
                message: "VID is required",
            });
        }

        const registry = await vehicleRegistryModel.findOneAndUpdate(
            { owner: userId },
            {
                $pull: { vehicles: vid },
            },
            { returnDocument: "after" }
        );

        if (!registry) {
            return res.status(404).json({
                message: "Registry not found",
            });
        }

        return res.status(200).json({
            message: "Vehicle removed",
            cars: registry.vehicles,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Failed to delete vehicle",
        });
    }
};

// export const updateCar = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;

//     const updatedCar = await vehicleRegistryModel.findByIdAndUpdate(
//       id,
//       req.body,
//       { returnDocument: 'after', runValidators: true }
//     );

//     if (!updatedCar) {
//       return res.status(404).json({ message: "Car not found" });
//     }

//     return res.status(200).json({message: "Car updated successfully", car: updatedCar});
//   } catch (error) {
//     res.status(500).json({ message: "Failed to update car" });
//   }
// };