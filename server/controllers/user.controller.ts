import { type Request, type Response } from "express";

import userModel from "../models/userModel.js";
import auditModel from "../models/auditModel.js";

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
