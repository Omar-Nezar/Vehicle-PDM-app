import jwt from "jsonwebtoken";

type tokenPayload = {
  _id: string;
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