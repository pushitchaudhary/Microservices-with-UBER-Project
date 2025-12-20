
// User Model Mongose Schema
import mongoose, { Document, Schema } from 'mongoose';

// Define the IRide interface
export interface IRide extends Document {
    // Define ride properties here
    toLocation: string;
    fromLocation: string;
    rideDate: Date;
    userId: string; // Reference to the user who booked the ride
    createdAt: Date;
    updatedAt: Date;
    captionId: string;
    status: string; // e.g., 'requested', 'in-progress', 'completed', 'canceled'
    idempotencyKey: string;
}   

const RideSchema: Schema = new Schema(
    {
        toLocation: { type: String, required: true },
        fromLocation: { type: String, required: true },
        rideDate: { type: Date, default: Date.now },
        userId: { type: String, required: true },
        captionId: { type: String, required: false },
        status: { type: String, default: 'requested' }, // Default status is 'requested'
        idempotencyKey: { type: String, required: true, unique: true },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    {
        timestamps: true,
    }
);

RideSchema.index({ idempotencyKey: 1 }, { unique: true });

const RideModel = mongoose.model<IRide>('Ride', RideSchema);
export default RideModel;