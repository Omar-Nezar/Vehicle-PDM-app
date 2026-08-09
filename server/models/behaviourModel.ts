import mongoose, {
    Document,
    Schema,
    Types,
} from "mongoose";

export enum DrivingStyle {
    AGGRESSIVE = "Aggressive",
    CALM = "Calm",
}

export enum Diligence {
    DILIGENT = "Diligent",
    IRRESPONSIBLE = "Irresponsible",
}

export interface IBehaviour extends Document {
    _id: Types.ObjectId;
    user: Types.ObjectId;
    driving_style: DrivingStyle;
    diligence: Diligence;
    createdAt: Date;
    updatedAt: Date;
}

const BehaviourSchema: Schema<IBehaviour> = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
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
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export default mongoose.model<IBehaviour>(
    "Behaviour",
    BehaviourSchema
);