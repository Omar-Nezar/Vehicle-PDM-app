import { type Request, type Response } from "express";
import { Types } from "mongoose";

import userModel from "../models/userModel.js";
import auditModel from "../models/auditModel.js";
import carModel from "../models/vehicleRegistryModel.js";

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

    if (!userId) {
      return res.status(400).json({ message: "Invalid or missing userId" });
    }

    const filter = userId
      ? { owner: new Types.ObjectId(userId as string) }
      : {}

    const cars = await carModel.find(filter);

    res.status(200).json({
      message: "User's cars fetched successfully",
      cars,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
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
