import jwt from "jsonwebtoken";

type tokenPayload = {
  _id: string;
  email: string;
  type: string;
};

export const generateToken = (payload: tokenPayload) => {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
};