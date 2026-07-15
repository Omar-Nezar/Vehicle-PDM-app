import { type Request, type Response } from "express";

import userModel from "../models/userModel.js";
import { comparePassword } from "../utils/hash.js"

// Register
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    // 2. Check if user already exists
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // 4. Create user
    const user = await userModel.create({
      name,
      email,
      password: password,
      role, // optional (defaults if not provided)
    });

    // 5. Remove password from response
    const userObj = user.toObject();
    const { password: _password, ...userWithoutPassword } = userObj;

    // 6. Return success response
    return res.status(201).json({
      message: "Registration successful",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// Login
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password, type } = req.body;

    // 1. Basic validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }
    // 2. Check if user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // 3. Check if password is correct
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // 5. Remove password from response
    const userObj = user.toObject();
    const { password: _password, ...userWithoutPassword } = userObj;

    // 6. Return success response
    return res.status(200).json({
      message: "Login successful",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
}