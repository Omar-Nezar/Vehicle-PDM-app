import jwt from "jsonwebtoken";
import { type IUser } from "../models/userModel.js";
import { type SignOptions } from "jsonwebtoken";

type tokenPayload = {
  _id: string;
  name: string;
  email: string;
  type: string;
};

export const generateToken = (
  payload: tokenPayload,
  use: string = "user"
) => {
  const secret: string | undefined =
    use === "user"
      ? process.env.JWT_SECRET
      : process.env.JWT_REFRESH_SECRET;
  const expiresIn: string | undefined =
    use === "user"
      ? process.env.JWT_SECRET_EXPIRES
      : process.env.JWT_REFRESH_SECRET_EXPIRES;

  if (!secret || !expiresIn) {
    throw new Error("JWT secret or expiration is not configured");
  }

  return jwt.sign(payload, secret as string, {
    expiresIn,
  } as SignOptions);
};

export const generateResetToken = (user: IUser) => {
  const secret: string = process.env.JWT_SECRET + user.password;

  return jwt.sign(
    { id: user._id },
    secret,
    { expiresIn: process.env.JWT_VERIFY_EXPIRES } as SignOptions
  );
};