import mongoose, { Document, Schema, Types } from "mongoose";
import { hashPassword } from "../utils/hash.js";
import { type IRefreshToken } from "../types/types.js";

// Allowed user types
export enum UserType {
    CAR_OWNER = "car_owner",
    ADMIN = "admin",
    INVENTORY_MANAGER = "inventory_manager",
}

export enum DrivingStyle { AGGRESSIVE = "Aggressive", CALM = "Calm", }
export enum Diligence { DILIGENT = "Diligent", IRRESPONSIBLE = "Irresponsible", }

// TypeScript interface
export interface IUser extends Document {
    _id: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    type: UserType;
    driving_style: DrivingStyle;
    diligence: Diligence;
    refreshTokens: IRefreshToken[];
    createdAt: Date;
    updatedAt: Date;
}

declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}

// Mongoose schema
const UserSchema: Schema<IUser> = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
        },
        type: {
            type: String,
            enum: Object.values(UserType),
            default: UserType.CAR_OWNER,
        },
        driving_style: {
            type: String,
            enum: Object.values(DrivingStyle),
            default: DrivingStyle.CALM,
        },
        diligence: {
            type: String,
            enum: Object.values(Diligence),
            default: Diligence.DILIGENT,
        },
        refreshTokens: [
            {
                _id: mongoose.Schema.Types.ObjectId,
                token: String,
            }
        ]
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// Hash on save
UserSchema.pre("save", async function (this: any) {
    const user = this as any;

    // Skip hashing when explicitly requested
    if (user.$locals.skipPasswordHash) {
        return;
    }

    // Only hash if password was modified
    if (!user.isModified("password")) {
        return;
    }

    user.password = await hashPassword(user.password);
});

// Hash on update
UserSchema.pre("findOneAndUpdate", async function (this: any) {
    const update = this.getUpdate() as { password?: string } | undefined;

    if (!update?.password) return;

    update.password = await hashPassword(update.password);
});

// Export model
export default mongoose.model<IUser>("users", UserSchema);