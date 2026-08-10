import mongoose, {
    Document,
    Schema,
    type HydratedDocument,
} from "mongoose";

export interface IVehicleData extends Omit<mongoose.Document, "model"> {
    vehicle_id: string; // VID (e.g. "V1")
    model: string;
    engine_type: string;
    engine_cc: number;
    weight_kg: number;
    vehicle_class: string;
    drivetrain: string;
    manufacture_year: number;
    avg_daily_km: number;
}

const vehicleDataSchema = new Schema<IVehicleData>(
    {
        vehicle_id: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },

        model: {
            type: String,
            required: true,
        },

        engine_type: {
            type: String,
            required: true,
        },

        engine_cc: {
            type: Number,
            required: true,
        },

        weight_kg: {
            type: Number,
            required: true,
        },

        vehicle_class: {
            type: String,
            required: true,
            enum: ["SUV", "Sedan"],
        },

        drivetrain: {
            type: String,
            required: true,
            enum: ["FWD", "RWD", "AWD"],
        },

        manufacture_year: {
            type: Number,
            required: true,
        },

        avg_daily_km: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: false, // dataset = no need
        versionKey: false,
    }
);

export type VehicleDataDocument = HydratedDocument<IVehicleData>;

export default mongoose.model<IVehicleData>(
    "vehicles",
    vehicleDataSchema,
);