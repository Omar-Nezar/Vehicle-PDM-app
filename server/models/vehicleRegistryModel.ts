import mongoose, {
    Schema,
    Types,
    type Document,
    type HydratedDocument,
} from "mongoose";

export interface IVehicleRegistry extends Document {
    owner: Types.ObjectId;
    vehicles: String[];
    createdAt: Date;
    updatedAt: Date;
}

const vehicleRegistrySchema = new Schema<IVehicleRegistry>(
    {
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },

        vehicles: [
            {
                type: String,
                ref: "Vehicle",
            },
        ],
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export type VehicleRegistryDocument = HydratedDocument<IVehicleRegistry>;

export default mongoose.model<IVehicleRegistry>(
    "vehicle_registry",
    vehicleRegistrySchema,
    "vehicle_registry",
);