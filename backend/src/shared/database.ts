import mongoose from 'mongoose';
import { envVars } from '../config/env';

let isConnected = false;

const connectDB = async (): Promise<void> => {
  // If already connected, return
  if (isConnected && mongoose.connection.readyState === 1) {
    console.log('🔄 Using existing MongoDB connection');
    return;
  }

  try {
    const mongoURI = envVars.MONGO_URI;
    if (!mongoURI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    console.log('🔌 Attempting to connect to MongoDB...');
    console.log('MongoDB URI format check:', mongoURI.substring(0, 20) + '...');

    // Simplified connection options for serverless
    await mongoose.connect(mongoURI);
    isConnected = true;

    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    isConnected = false;

    // Log additional details
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack?.substring(0, 500)
      });
    }

    throw error; // Don't exit in serverless environment
  }
};// Handle MongoDB connection events
mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected');
  isConnected = false;
});

mongoose.connection.on('reconnected', () => {
  console.log('🔄 MongoDB reconnected');
  isConnected = true;
});

// Don't use process.exit in serverless environment
if (envVars.NODE_ENV !== 'production') {
  process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('MongoDB connection closed due to app termination');
    process.exit(0);
  });
}

export default connectDB;
