import { jwtDecode } from "jwt-decode";

interface TokenPayload {
    _id: string;
    email: string;
    type: string;
    iat?: number;
    exp?: number;
}

export default function decodeToken(token?: string): TokenPayload | null {
    const authToken = token ?? localStorage.getItem("authToken");
    if (!authToken) {
        return null;
    }
    try {
        return jwtDecode<TokenPayload>(authToken);
    } catch (error) {
        return null;
    }
}