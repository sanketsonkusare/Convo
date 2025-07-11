import mongoose from "mongoose";

export const connectDB = async () => {
    try{
        // Use MONGODB_URI for production (Render), MONGO_URI for local development
        const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.MONGO_URL;
        
        if (!mongoUri) {
            throw new Error('MongoDB URI is not defined. Please set MONGODB_URI or MONGO_URI in your environment variables.');
        }
        
        const connect = await mongoose.connect(mongoUri);
        console.log(`Connected to db:${connect.connection.host}`)
    } catch (error) {
        console.log(`Database connection error:`,error);
        process.exit(1);
    }
};