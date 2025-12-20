
// Middleware for user authentication from JWT
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../interface/AuthenticatedRequest';
import axios from 'axios';


// Middleware to authenticate user using JWT
export const authenticatedUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    console.log('Ride Authenticating user...');
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing or malformed' });
    }

    if (!authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization header missing or malformed' });
    }

    const token = authHeader.slice(7); // Remove 'Bearer ' prefix
    try {
        console.log('Verifying token with User service...');
        const userDetails = await axios.get(`https://j1ms5nk8-4001.inc1.devtunnels.ms/api/users/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('Token verified successfully');
        // console.log('User authenticated:', userDetails.data);
        
        // // Attach user info to request and proceed
        req.user = userDetails.data.user || userDetails.data;
        next();

    } catch (error: any) {
        console.error('Authentication error:', error.message || error);
        return res.status(401).json({ 
            message: 'Invalid or expired token',
            error: error.message || 'Unknown error'
        });
    }
};

