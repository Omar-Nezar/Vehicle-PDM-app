import { type Request, type Response } from "express";

import userModel from "../models/userModel.js";
import { hashPassword, comparePassword } from "../utils/hash.js"
import { generateToken, generateResetToken } from "../utils/generate_token.js";
import { decode, decodeSecret } from "../utils/decode_tokens.js"
import { type IRefreshToken } from "../types/types.js";
import { sendEmail } from "../utils/email.js";

// Schemas
import { registerSchema } from "@shared/schemas/user.schema.js";
import { resetPwdSchema } from "@shared/schemas/resetPwd.schema.js"
import { changePwdSchema } from "@shared/schemas/changePwd.schema.js"

// Register
export const registerUser = async (req: Request, res: Response) => {
  try {
    // Validate input
    const parsed = registerSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        errors: parsed.error.issues,
      });
    }

    const { name, email, password, type } = req.body;

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Create user
    const user = await userModel.create({
      name,
      email,
      password: password,
      type, // optional (defaults if not provided)
    });

    // Create token
    const token = generateToken({
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      type: user.type,
    });

    // Return success response
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

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }
    // Check if user exists
    const user = await userModel.findOne({ email, type });
    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // Check if password is correct
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // Create access token
    const token = generateToken({
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      type: user.type,
    });

    // Store refresh token in DB
    const refreshToken = generateToken({
      _id: user._id.toString(),
      name: user.name,
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

    // Return success response
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
    name: user.name,
    email: user.email,
    type: user.type,
  });

  res.json({ token: newToken });
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { name } = req.body;

    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          ...(name && { name }),
        },
      },
      { returnDocument: 'after' }
    ).select("-password -refreshTokens");

    if (!updatedUser) {
      return res.status(400).json({ message: "User not found" });
    }

    const newToken = generateToken({
      _id: updatedUser._id.toString(),
      name: updatedUser.name,
      email: updatedUser.email,
      type: updatedUser.type,
    })

    res.status(200).json({ message: "User updated successfully", user: updatedUser, token: newToken });
  } catch (err) {
    res.status(500).json({ message: "Failed to update user" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
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
    res.status(200).json({ message: "Logged out" });
  } catch (err) {
    res.status(500).json({ message: "Logout failed" });
  }
}

export const forgotPassword = async (req: Request, res: Response) => {
  const msg = "If user exists, email sent"
  const { email } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(200).json({ message: msg });
  }

  const token = generateResetToken(user);

  const resetUrl = `${process.env.CLIENT_URL}/resetpassword/${user._id}/${token}`;

  const message = `
    Click to reset password:
    ${resetUrl}

    This link expires in 15 minutes.
  `;

  await sendEmail({
    to: user.email,
    subject: "Password Reset",
    text: message,
  });

  return res.status(200).json({ message: msg });
};

export const resetPassword = async (req: Request, res: Response) => {
  const { id, token } = req.params;

  // Validate input
  const parsed = resetPwdSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      errors: parsed.error.issues,
    });
  }

  const user = await userModel.findById(id);
  if (!user || !token) {
    return res.status(400).json({ message: "Invalid link" });
  }

  const secret = process.env.JWT_SECRET + user.password;

  try {
    const decoded = decodeSecret(token as string, secret);

    user.password = req.body.password;
    console.log("Password reset successful for user:", user.email, user.password, req.body.password);
    await user.save();

    res.status(200).json({ message: "Password reset successful" });

  } catch (err) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { oldPassword, password } = req.body;

    // Validate input
    const parsed = changePwdSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        errors: parsed.error.issues,
      });
    }

    const user = await userModel.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check old password
    const isMatch = await comparePassword(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    user.password = password;

    await user.save();

    res.status(200).json({ message: "Password updated successfully" });

  } catch (err) {
    res.status(500).json({ message: "Failed to change password" });
  }
};