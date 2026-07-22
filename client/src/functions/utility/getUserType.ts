import decodeToken from "./decodeToken";

interface TokenPayload {
    _id: string;
    email: string;
    type: string;
    iat?: number;
    exp?: number;
}

export default function getUserType(decodedToken?: TokenPayload): TokenPayload["type"] | null {
    const authToken = decodedToken ?? decodeToken();
    return authToken?.type as string ?? null;
}