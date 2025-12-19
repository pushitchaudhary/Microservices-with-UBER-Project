import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
    try {
        const uri = process.env.MONGO_URI as string;
        await mongoose.connect(uri);
        console.log('MongoDB Rider Service connected successfully');
    } catch (error) {
        console.error('MongoDB Rider Service connection error:', error);
        process.exit(1);
    }
};

export default connectDB;