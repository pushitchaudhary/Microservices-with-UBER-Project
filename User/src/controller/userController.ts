import {Request, Response} from 'express'

import User, { IUser } from '../model/userModel';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


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

    // User Login
    async loginUser(req: Request, res: Response): Promise<void> {
        // Implementation for user login
        console.log('Received login request with body:', req.body);
        const { email, password } = req.body || {};

        // Basic validation: ensure required fields are present
        if (!email || !password) {
            res.status(400).json({ message: 'Missing required fields: email, password' });
            return;
        }

        // Find user by email
        const user = await User.findOne({ email: email });
        if (!user) {
            res.status(401).json({ message: 'Invalid email or password' });
            return;
        }

        // Compare provided password with stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: 'Invalid email or password' });
            return;
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET || 'your_jwt_secret',
            { expiresIn: '1h' }
        );

        

        // If login is successful, send a success response
        console.log('User logged in successfully:', token);

        res.status(200).json({ message: 'Login successful', token: token });
    }

   


}

export default new UserController();