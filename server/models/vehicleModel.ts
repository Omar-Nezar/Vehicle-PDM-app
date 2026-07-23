import mongoose, { Schema, Document, Types, type HydratedDocument } from "mongoose";

interface IVehicle {
  owner: Types.ObjectId;
  make: string;
  model: string;
  year: number;
  plateNumber: string;
  mileage: number;
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
      unique: true, // optional
    },
    mileage: {
        type: Number,
        required: true,
    }
  },
  { timestamps: true }
);

export type VehicleDocument = HydratedDocument<IVehicle>;
export default mongoose.model<IVehicle>("vehicles", vehicleSchema);