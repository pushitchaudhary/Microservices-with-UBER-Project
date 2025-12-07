import {Request, Response} from 'express'

import User, { IUser } from '../model/userModel';
import bcrypt from 'bcryptjs';
import { IUserRole } from '../enum/IUserEnum';


class UserController {

    // User Registration
    async registerUser(req: Request, res: Response): Promise<void> {
        // Implementation for user registration

        console.log('Received registration request with body:', req.body);
        const { username, email, password } = req.body || {};


        // Basic validation: ensure required fields are present
        if (!username || !email || !password) {
            res.status(400).json({ message: 'Missing required fields: username, email, password' });
            return;
        }

        // Sanitize input to prevent injection attacks
     
        // To check if user already exists
        const existingUser= await User.findOne({ email: email });

        // If user already exists, return conflict response
        console.log('Existing user check for email:', existingUser);
        if (existingUser) {
            res.status(400).json({ message: 'User with this email already exists' });
            return;
        }

        console.log('Proceeding to register new user');

        // Hash the password before saving (implementation not shown here)
        const hashedPassword = await bcrypt.hash(password, 10); // Replace this with actual hashing logic
        

        // Save sanitized user data to the database
        const newUser = new User({
            username: username,
            email: email,
            password: hashedPassword,
        });

        await newUser.save();

        // Here you would typically add logic to save the user to the database
        // For demonstration, we'll just log the user data and send a success response
        console.log('Registering user:', { username, email, password });

        res.status(201).json({ message: 'User registered successfully' });

    }

   


}

export default new UserController();