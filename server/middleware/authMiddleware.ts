import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

interface AuthRequest extends Request {
    user?: any;
}

interface DecodedToken {
    _id: string;
    email: string;
    type: string;
    iat?: number;
    exp?: number;
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
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken

            req.user = await userModel.findById(decoded._id).select("-password");
            console.log(decoded)
            console.log("User " + req.user)
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