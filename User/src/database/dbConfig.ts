import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
    try {
        const uri = process.env.MONGO_URI as string;
        await mongoose.connect(uri);
        console.log('MongoDB User Service connected successfully');
    } catch (error) {
        console.error('MongoDB User Service connection error:', error);
        process.exit(1);
    }
};

export default connectDB;