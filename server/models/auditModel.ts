import mongoose, { Schema, Document } from "mongoose";

export interface IAuditLog extends Document {
    userId?: string;
    method: string;
    route: string;
    statusCode: number;
    body?: any;
    ip?: string;
    userAgent?: string;
    createdAt: Date;
    durationMs?: number;
}

const auditLogSchema = new Schema<IAuditLog>(
    {
        userId: { type: String },
        method: { type: String, required: true },
        route: { type: String, required: true },
        statusCode: { type: Number, required: true },
        body: { type: Schema.Types.Mixed },
        ip: String,
        userAgent: String,
        durationMs: { type: Number },
        createdAt: {
            type: Date,
            default: Date.now,
            expires: "7d",
        }
    },
    {
        versionKey: false
    }
);

export default mongoose.model<IAuditLog>("AuditLog", auditLogSchema);