import { type Request, type Response } from "express";

import userModel from "../models/userModel.js";

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