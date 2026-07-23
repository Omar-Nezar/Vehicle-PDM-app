import mongoose, { Schema, Document, Types, type HydratedDocument } from "mongoose";

interface IVehicle {
    owner: Types.ObjectId;
    make: string;
    model: string;
    year: number;
    plateNumber: string;
    mileage: number;
    vin: string;
    createdAt: Date;
    updatedAt: Date;
}

const vehicleSchema = new Schema<IVehicle>(
    {
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        make: {
            type: String,
            required: true,
        },
        model: {
            type: String,
            required: true,
        },
        year: {
            type: Number,
            required: true,
        },
        plateNumber: {
            type: String,
            required: true,
        },
        mileage: {
            type: Number,
            required: true,
        },
        vin: {
            type: String,
            required: true,
            unique: true
        }
    },
    { timestamps: true }
);

export type VehicleDocument = HydratedDocument<IVehicle>;
export default mongoose.model<IVehicle>("vehicles", vehicleSchema);