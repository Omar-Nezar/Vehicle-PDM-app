import { type Request, type Response } from "express";
import { type AuthRequest } from "../middleware/authMiddleware.js";
import vehicleRegistryModel from "../models/vehicleRegistryModel.js";
import vehicleModel from "../models/vehicleModel.js";
import type { Types } from "mongoose";
import axios from "axios";

export const addCar = async (req: AuthRequest, res: Response) => {
    try {
        const { vid } = req.params;

        if (!vid) {
            return res.status(400).json({
                message: "VID is required",
            });
        }

        const exists = await vehicleModel.findOne({ vehicle_id: vid });
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

        const cars = await vehicleModel.find({
            vehicle_id: { $in: registry.vehicles as string[] },
        });

        return res.status(200).json({
            message: "Car added successfully",
            cars,
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

        const registry = await vehicleRegistryModel.findOne({
            owner: userId,
        });

        if (!registry || registry.vehicles.length === 0) {
            return res.status(200).json({
                message: "Cars fetched successfully",
                cars: [],
            });
        }

        const cars = await vehicleModel.find({
            vehicle_id: { $in: registry.vehicles as string[] },
        });

        return res.status(200).json({
            message: "Cars fetched successfully",
            cars,
        });
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Failed to fetch vehicles",
        });
    }
};

export const getCarByVid = async (req: AuthRequest, res: Response) => {
    try {
        const { vid } = req.params;

        if (!vid) {
            return res.status(400).json({
                message: "VID is required",
            });
        }

        const existingOwner = await vehicleRegistryModel.findOne({
            vehicles: vid,
        });

        if (existingOwner) {
            if (existingOwner.owner.toString() === req.user._id.toString()) {
                return res.status(409).json({
                    message: "This vehicle is already owned by you",
                });
            }
            return res.status(409).json({
                message: "This vehicle is already owned by another user",
            });
        }

        // Fetch actual vehicle details
        const vehicle = await vehicleModel.findOne({
            vehicle_id: vid,
        });

        if (!vehicle) {
            return res.status(404).json({
                message: "Vehicle details not found",
            });
        }

        return res.status(200).json({
            message: "Vehicle fetched successfully",
            car: vehicle,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Failed to fetch vehicle",
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

        // Fetch actual vehicle documents
        const vehicles = await vehicleModel.find({
            vehicle_id: { $in: registry.vehicles as string[] },
        });

        return res.status(200).json({
            message: "Vehicle removed",
            cars: vehicles,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Failed to delete vehicle",
        });
    }
};

export const getCarsSurvival = async (req: AuthRequest, res: Response) => {
    try {
        const registry = await vehicleRegistryModel.findOne({
            owner: req.user._id,
        });
        if (!registry) {
            return res.status(200).json({});
        }
        const vehicleIds = registry.vehicles;

        if (!vehicleIds || vehicleIds.length === 0) {
            return res.status(200).json({});
        }

        const response = await axios.post(
            `${process.env.ML_API_URL}/ml/survival`,
            {
                vehicle_ids: vehicleIds.map(
                    (vehicleId) => String(vehicleId)
                ),
            }
        );

        // --------------------------------------------------
        // Return predictions
        // --------------------------------------------------

        return res.status(200).json(
            response.data
        );
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to fetch vehicle",
        });
    }
}

export const getCarsSurvivalTest = async (req: AuthRequest, res: Response) => {
    try {
        const registry = await vehicleRegistryModel.findOne({
            owner: req.params._id as string,
        });
        if (!registry) {
            return res.status(200).json({});
        }
        const vehicleIds = registry.vehicles;

        if (!vehicleIds || vehicleIds.length === 0) {
            return res.status(200).json({});
        }

        const response = await axios.post(
            `${process.env.ML_API_URL}/ml/survival`,
            {
                vehicle_ids: vehicleIds.map(
                    (vehicleId) => String(vehicleId)
                ),
            }
        );

        // --------------------------------------------------
        // Return predictions
        // --------------------------------------------------

        return res.status(200).json(
            response.data
        );
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to fetch vehicle",
        });
    }
}

export const getProjections = async (req: AuthRequest, res: Response) => {
    try {
        const result = await axios.get(`${process.env.ML_API_URL}/ml/projection`);
        return res.status(200).json(result.data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to fetch projection",
        });
    }
}