import { type Request, type Response } from "express";
import { Types } from "mongoose";

import userModel from "../models/userModel.js";
import auditModel from "../models/auditModel.js";
import vehicleModel from "../models/vehicleModel.js";
import vehicleRegistryModel from "../models/vehicleRegistryModel.js";
import serviceHistoryModel from "../models/serviceHistoryModel.js";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await userModel.find();
    return res.status(200).json({
      message: "Users fetched successfully",
      users,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
}

export const getUserCars = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const registry = await vehicleRegistryModel.findOne({
      owner: userId as string,
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

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await userModel.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.deleteOne();

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getAuditLogs = async (req: Request, res: Response) => {
  try {
    const logs = await auditModel.find().sort({ createdAt: -1 });
    return res.status(200).json({
      message: "Audit logs fetched successfully",
      logs,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const getServiceHistory = async (req: Request, res: Response) => {
  try {
    const history = await serviceHistoryModel.find();

    return res.status(200).json({
      message: "Service history fetched successfully",
      history,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch service history",
    });
  }
};

export const getVehicles = async (req: Request, res: Response) => {
  try {
    const vehicles = await vehicleModel.find()

    return res.status(200).json({
      message: "Vehicles fetched successfully",
      vehicles
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      message: "Failed to fetch vehicles"
    })
  }
}