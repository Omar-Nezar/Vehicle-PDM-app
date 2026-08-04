import { type Request, type Response, type NextFunction } from "express";
import AuditLog from "../models/auditModel.js";

export const auditMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const methodsToLog = ["POST", "PUT", "DELETE"];

    if (!methodsToLog.includes(req.method)) return next();

    const start = Date.now();

    // Capture response finish
    res.on("finish", async () => {
        try {
            // sanitize sensitive fields
            const sensitiveFields = ["password", "oldPassword", "newPassword", "confirmPassword"];
            const sanitizedBody = { ...req.body };
            sensitiveFields.forEach(async (field) => {
                if (sanitizedBody[field] !== undefined) {
                    sanitizedBody[field] = "***";
                }
            });

            const auditPayload = {
                method: req.method,
                route: req.originalUrl,
                statusCode: res.statusCode,
                body: sanitizedBody,
                createdAt: new Date(),
                durationMs: Date.now() - start,
                ...(req.user?._id ? { userId: req.user._id.toString() } : {}),
                ...(req.ip ? { ip: req.ip } : {}),
                ...(req.headers["user-agent"] ? { userAgent: req.headers["user-agent"] } : {}),
            };

            await AuditLog.create(auditPayload);
        } catch (err) {
            console.error("Audit log failed:", err);
        }
    });

    next();
};