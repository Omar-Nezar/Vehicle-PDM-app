import mongoose, { Document, Schema, Types } from "mongoose";
import { hashPassword } from "../utils/hash.js";


// Allowed user roles
export enum UserRole {
    CAR_OWNER = "car_owner",
    ADMIN = "admin",
    INVENTORY_MANAGER = "inventory_manager",
}

// TypeScript interface
export interface IUser extends Document {
    _id: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
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
        role: {
            type: String,
            enum: Object.values(UserRole),
            default: UserRole.CAR_OWNER,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// Hash on save
UserSchema.pre("save", async function (this: any) {
  const user = this as any;

  if (!user.isModified("password")) return;

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