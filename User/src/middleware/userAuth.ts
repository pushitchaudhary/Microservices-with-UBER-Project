
// Middleware for user authentication from JWT
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UserModel from '../model/userModel';
import { AuthenticatedRequest } from '../interface/AuthenticatedRequest';


// Middleware to authenticate user using JWT
export const authenticatedUser = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing or malformed' });
    }

    if (!authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization header missing or malformed' });
    }

    const token = authHeader.slice(7); // Remove 'Bearer ' prefix

    try {
        const secret = process.env.JWT_SECRET || 'your_jwt_secret';
        const decoded: any = jwt.verify(token, secret);
        const user = { userId: decoded.userId, email: decoded.email };


        // Verify user exists in database
        UserModel.findById(user.userId).then(foundUser => {
            if (!foundUser) {
                return res.status(401).json({ message: 'User not found' });
            }
            req.user = user;
            next();
        }).catch(err => {
            return res.status(500).json({ message: 'Internal server error' });
        });
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

