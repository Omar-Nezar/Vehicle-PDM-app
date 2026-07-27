import { type Request, type Response } from "express";
import vehicleModel from "../models/vehicleModel.js";
import { type AuthRequest } from "../middleware/authMiddleware.js";

export const addCar = async (req: AuthRequest, res: Response) => {
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

        const car = await vehicleModel.create({
            owner: user,
            make,
            model,
            year,
            plateNumber,
            mileage,
            vin
        });

        return res.status(201).json({
            message: "Car added successfully",
            car,
        });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

export const getCars = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user.id;

    const vehicles = await vehicleModel.find({ owner: user }).sort({
      createdAt: -1,
    });

    return res.status(200).json({message: "Cars fetched successfully", cars: vehicles});
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch vehicles" });
  }
};

export const deleteCar = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user.id;
    const { id } = req.params;

    const vehicle = await vehicleModel.findOneAndDelete({
      _id: id,
      owner: user,
    });

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.status(200).json({ message: "Vehicle deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete vehicle" });
  }
};

export const updateCar = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const updatedCar = await vehicleModel.findByIdAndUpdate(
      id,
      req.body,
      { returnDocument: 'after', runValidators: true }
    );

    if (!updatedCar) {
      return res.status(404).json({ message: "Car not found" });
    }

    return res.status(200).json({message: "Car updated successfully", car: updatedCar});
  } catch (error) {
    res.status(500).json({ message: "Failed to update car" });
  }
};