import mongoose, {
    Schema,
    type Document,
    type HydratedDocument,
} from "mongoose";

export interface IServiceHistory extends Document {
    vehicle_id: string;
    service_date: Date;
    season: string;
    ambient_temp: number;
    vehicle_age: number;
    mileage: number;
    missed_services: number;
    service_type: string;
    failure_occurred: number;
    failure_type?: string;
    parts_replaced?: string;
    service_cost: number;
    createdAt: Date;
    updatedAt: Date;
}

const serviceHistorySchema = new Schema<IServiceHistory>(
    {
        vehicle_id: {
            type: String,
            required: true,
            index: true,
        },
        service_date: {
            type: Date,
            required: true,
        },
        season: {
            type: String,
            required: true,
        },
        ambient_temp: {
            type: Number,
            required: true,
        },
        vehicle_age: {
            type: Number,
            required: true,
        },
        mileage: {
            type: Number,
            required: true,
        },
        missed_services: {
            type: Number,
            required: true,
        },
        service_type: {
            type: String,
            required: true,
        },
        failure_occurred: {
            type: Number,
            required: true,
        },
        failure_type: {
            type: String,
        },
        parts_replaced: {
            type: String,
        },
        service_cost: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export type ServiceHistoryDocument = HydratedDocument<IServiceHistory>;

export default mongoose.model<IServiceHistory>(
    "service_history",
    serviceHistorySchema,
    "service_history"
);