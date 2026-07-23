import jwt from "jsonwebtoken";

interface DecodedToken {
    _id: string;
    email: string;
    type: string;
    iat?: number;
    exp?: number;
}

export default function decode(token: string, use: string = "user") {
    if (use === "user") {
        return jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken
    } else {
        return jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as DecodedToken
    }
}