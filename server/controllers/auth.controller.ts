import { type Request, type Response } from "express";

import userModel from "../models/userModel.js";
import { comparePassword } from "../utils/hash.js"
import { generateToken } from "../utils/generate_token.js";
import decode from "../utils/decode_tokens.js"
import { registerSchema } from "@shared/schemas/user.schema.js";
import { type IRefreshToken } from "../types/types.js";

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

    // 5. Create access token
    const token = generateToken({
      _id: user._id.toString(),
      email: user.email,
      type: user.type,
    });

    // 6. Store refresh token in DB
    const refreshToken = generateToken({
      _id: user._id.toString(),
      email: user.email,
      type: user.type,
    }, "refresh");

    const refreshTokenDoc: IRefreshToken = {
      token: refreshToken,
      createdAt: new Date()
    };

    user.refreshTokens.push(refreshTokenDoc);
    await user.save();

    // Send cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // set true in prod
      sameSite: "lax", // strict
    });

    // 7. Return success response
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

export const refresh = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;

  if (!token) return res.sendStatus(401);

  let decoded;

  try {
    decoded = decode(token, "refresh");
  } catch (err) {
    return res.sendStatus(403); // invalid or expired refresh token
  }

  const user = await userModel.findById(decoded._id);

  if (!user || !user.refreshTokens.some(rt => rt.token === token)) {
    return res.sendStatus(403);
  }

  const newToken = generateToken({
    _id: user._id.toString(),
    email: user.email,
    type: user.type,
  });

  res.json({ token: newToken });
};

export const logout = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;

  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  await userModel.updateOne(
    { _id: req.user._id },
    {
      $pull: {
        refreshTokens: { token: token }
      }
    }
  );

  res.clearCookie("refreshToken");
  res.json({ message: "Logged out" });
}