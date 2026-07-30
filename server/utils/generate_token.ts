import jwt from "jsonwebtoken";
import { type IUser } from "../models/userModel.js";

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
  if (use === "user") {
    return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: "1h", });
  } else {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, { expiresIn: "4h", })
  }
};

export const generateResetToken = (user: IUser) => {
  const secret = process.env.JWT_SECRET + user.password;

  return jwt.sign(
    { id: user._id },
    secret,
    { expiresIn: "15m" }
  );
};