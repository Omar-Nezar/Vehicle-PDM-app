import jwt from "jsonwebtoken";
import { type SignOptions } from "jsonwebtoken";

type tokenPayload = {
  _id: string;
  email: string;
  type: string;
};

export const generateToken = (
  payload: tokenPayload,
  expiresIn: SignOptions["expiresIn"] = "1d"
) => {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn,
  });
};