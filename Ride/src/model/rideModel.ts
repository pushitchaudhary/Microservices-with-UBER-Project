
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
    status: string; // e.g., 'requested', 'in-progress', 'completed', 'canceled', 
}   

const RideSchema: Schema = new Schema(
    {
        toLocation: { type: String, required: true },
        fromLocation: { type: String, required: true },
        rideDate: { type: Date, required: true },
        userId: { type: String, required: true },
        captionId: { type: String, required: true },
        status: { type: String, default: 'requested' }, // Default status is 'requested'
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    {
        timestamps: true,
    }
);

const RideModel = mongoose.model<IRide>('Ride', RideSchema);
export default RideModel;