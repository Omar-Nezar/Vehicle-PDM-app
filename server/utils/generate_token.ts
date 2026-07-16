import jwt from "jsonwebtoken";

type Payload = {
  userId: string;
  email: string;
  type: string;
};

export const generateToken = (payload: Payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
};