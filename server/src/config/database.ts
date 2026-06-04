import mongoose from 'mongoose';
import { env } from './env';

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 2000; // Starting delay

export const connectDB = async () => {
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      console.log(`Attempting to connect to MongoDB (Attempt ${retries + 1}/${MAX_RETRIES})...`);
      
      await mongoose.connect(env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
      });
      
      console.log('✅ Successfully connected to MongoDB.');
      return;
    } catch (error) {
      retries++;
      console.error(`❌ MongoDB connection failed: ${(error as Error).message}`);
      
      if (retries >= MAX_RETRIES) {
        console.error('Max retries reached. Exiting...');
        process.exit(1);
      }
      
      const delay = RETRY_DELAY_MS * Math.pow(2, retries - 1); // Exponential backoff
      console.log(`Waiting ${delay}ms before next attempt...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB disconnected.');
});

mongoose.connection.on('reconnected', () => {
  console.info('✅ MongoDB reconnected.');
});
