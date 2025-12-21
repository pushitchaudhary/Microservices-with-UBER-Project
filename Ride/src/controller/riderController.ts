import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../interface/AuthenticatedRequest';
import RideModel from '../model/rideModel';
import redisClient from '../services/redisConnector';


class RiderController {

    // Method to request a ride
    async requestRide(req: AuthenticatedRequest, res: Response): Promise<void> {
        const userDetails = req.user;
        const { toLocation, fromLocation }: any = req.body || {};
        const idempotencyKey = (req.headers['idempotency-key'] as string) || (req.headers['Idempotency-Key'] as string);



        if (!userDetails) {
            res.status(401).json({ message: 'Unauthorized: User details missing' });
            return;
        }

        if (!toLocation || !fromLocation) {
            res.status(400).json({ message: 'Missing required fields: toLocation, fromLocation' });
            return;
        }

        if (!idempotencyKey) {
            res.status(400).json({ message: 'Missing idempotency key' });
            return;
        }





        const userId = (userDetails as any)._id || (userDetails as any).userId;

        try {
            const result: any = await RideModel.findOneAndUpdate(
                { idempotencyKey },
                {
                    $setOnInsert: {
                        userId,
                        toLocation,
                        fromLocation,
                        status: 'requested',
                        rideDate: new Date(),
                    },
                },
                {
                    upsert: true,
                    new: true,
                    setDefaultsOnInsert: true,
                    rawResult: true,
                    runValidators: true,
                }
            );

                // Create redis key for idempotency
            console.log('Setting idempotency key in Redis:', `ride_request:${idempotencyKey}`);
            await redisClient.set(
            `ride_request:${idempotencyKey}`,
            JSON.stringify({
                status: 'processing',
                userId:'2323242',
                createdAt: Date.now()
            }),
            { NX: true, EX: 300 }
            );



            const ride = result;
            const created = ride.createdAt.getTime() === ride.updatedAt.getTime();

            if (!ride) {
                throw new Error('Ride could not be created or retrieved');
            }

            const statusCode = created ? 201 : 200;
            res.status(statusCode).json({
                message: created ? 'Ride requested successfully' : 'Ride request already processed',
                ride,
            });

        } catch (error: any) {
            // Handle duplicate idempotency key races gracefully
            if (error?.code === 11000) {
                const existing = await RideModel.findOne({ idempotencyKey });
                if (existing) {
                    res.status(200).json({ message: 'Ride request already processed', ride: existing });
                    return;
                }
            }

            console.error('Ride request error:', error);
            res.status(500).json({ message: 'Could not process ride request', error: error?.message || 'Unknown error' });
        }
    }

    //  Method to get all rides for a user
    async getRides(req: AuthenticatedRequest, res: Response): Promise<void> {
        const userDetails = req.user;
        
        if (!userDetails) {
            res.status(401).json({ message: 'Unauthorized: User details missing' });
            return;
        }

        const userId = (userDetails as any)._id || (userDetails as any).userId;

        try {
            const rides = await RideModel.find({ userId }).sort({ rideDate: -1 });
            res.status(200).json({ rides });
        } catch (error: any) {
            console.error('Error fetching rides:', error);
            res.status(500).json({ message: 'Could not fetch rides', error: error?.message || 'Unknown error' });
        }
    }
    
    // Method to get ride status
    // async getRideStatus(req: Request, res: Response): Promise<void> {
    //     // Implementation for getting ride status
    //     const rideId = req.params.rideId;
    //     console.log('Fetching status for ride ID:', rideId);
    //     res.status(200).json({ rideId: rideId, status: 'In Progress' });
    // }

    // // Method to cancel a ride
    // async cancelRide(req: Request, res: Response): Promise<void> {
    //     // Implementation for cancelling a ride
    //     const rideId = req.params.rideId;
    //     console.log('Cancelling ride ID:', rideId);
    //     res.status(200).json({ message: `Ride ID ${rideId} cancelled successfully` });
    // }





}

export default new RiderController;