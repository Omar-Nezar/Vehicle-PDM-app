import { type Response } from "express";
import { generateToken } from "./generate_token.js";
import { type IUser } from "../models/userModel.js";
import { type IRefreshToken } from "../types/types.js";

const authHelper = async (user: IUser, res: Response) => {
  // Create access token
  const accessToken = generateToken({
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    type: user.type,
  });

  // Create refresh token
  const refreshToken = generateToken(
    {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      type: user.type,
    },
    "refresh"
  );

  // Store refresh token in DB
  const refreshTokenDoc: IRefreshToken = {
    token: refreshToken,
    createdAt: new Date(),
  };

  user.refreshTokens.push(refreshTokenDoc);
  await user.save();

  // Send cookie
  // resolve cookie option types (process.env values are strings)
  const secureFlag: boolean = process.env.SECURE_COOKIE === "true";
  const validSameSites = ["lax", "strict", "none"] as const;

  type SameSite = (typeof validSameSites)[number];

  const rawSameSite = process.env.SAMESITE_COOKIE?.toLowerCase();

  let sameSiteOption: SameSite = "lax";

  if (rawSameSite && validSameSites.includes(rawSameSite as SameSite)) {
    sameSiteOption = rawSameSite as SameSite;
  } else if (rawSameSite) {
    console.warn(`Invalid SAMESITE_COOKIE value: ${rawSameSite}`);
  }

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: secureFlag,
    sameSite: sameSiteOption,
  });

  return accessToken;
};

export default authHelper;