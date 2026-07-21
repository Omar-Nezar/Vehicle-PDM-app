import { type Request, type Response } from "express";

import userModel from "../models/userModel.js";
import { comparePassword } from "../utils/hash.js"
import { generateToken } from "../utils/generate_token.js";
import { registerSchema } from "@shared/schemas/user.schema.js";

// Register
export const registerUser = async (req: Request, res: Response) => {
  try {
    // 1. Validate input
    const parsed = registerSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        errors: parsed.error.issues,
      });
    }

    const { name, email, password, type } = req.body;

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
      type, // optional (defaults if not provided)
    });

    // 5. Create token
    const token = generateToken({
      _id: user._id.toString(),
      email: user.email,
      type: user.type,
    });

    // 6. Return success response
    return res.status(201).json({
      message: "Registration successful",
      token,
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
    const user = await userModel.findOne({ email, type });
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

    // 5. Create token
    const token = generateToken({
      _id: user._id.toString(),
      email: user.email,
      type: user.type,
    });

    // 6. Return success response
    return res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
}