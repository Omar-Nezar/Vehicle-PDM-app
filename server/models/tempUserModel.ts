import mongoose, { Schema, Document } from "mongoose";
import { hashPassword } from "../utils/hash.js";

export interface ItempUser extends Document {
    name: string;
    email: string;
    password: string;
    type: string;

    token: string;
    expiresAt: Date;
}


const tempUserSchema = new Schema<ItempUser>(
    {
        name: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
        },

        password: {
            type: String,
            required: true,
        },

        type: {
            type: String,
            default: "car_owner",
            required: false,
        },

        token: {
            type: String,
            required: true,
        },

        expiresAt: {
            type: Date,
            required: true,
            expires: 0, // MongoDB TTL cleanup
        },
    },
    {
        timestamps: true,
    }
);

// Hash on save
tempUserSchema.pre("save", async function (this: any) {
    const user = this as any;

    if (!user.isModified("password")) return;

    user.password = await hashPassword(user.password);
});

// Hash on update
tempUserSchema.pre("findOneAndUpdate", async function (this: any) {
    const update = this.getUpdate() as { password?: string } | undefined;

    if (!update?.password) return;

    update.password = await hashPassword(update.password);
});

export default mongoose.model(
    "temp_user",
    tempUserSchema
);