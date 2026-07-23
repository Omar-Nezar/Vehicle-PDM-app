import { type Request, type Response, type NextFunction } from "express";
import decode from "../utils/decode_tokens.js";
import userModel from "../models/userModel.js";

export interface AuthRequest extends Request {
    user?: any;
}

export const protect = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1] as string;
            const decoded = decode(token)
            req.user = await userModel.findById(decoded._id).select("-password");
            if (!req.user) {
                return res.status(401).json({ message: "User not found" });
            }

            next();
        } catch (error) {
            return res.status(401).json({ message: "Not authorized, token failed" });
        }
    }

    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }
};

export const adminOnly = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    if (req.user && req.user.type === "admin") {
        next();
    } else {
        console.log("here")
        return res.status(403).json({ message: "Admin access required" });
    }
};

export const carOwnerOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user && req.user.type === "car_owner") {
    next();
  } else {
    return res.status(403).json({ message: "Car owner access required" });
  }
};