import jwt from "jsonwebtoken";

interface DecodedToken {
    _id: string;
    email: string;
    type: string;
    iat?: number;
    exp?: number;
}

export default function decode(token: string) {
    return jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken
}