import mongoose from 'mongoose';
import { config } from './config.js';

let isMongoConnected = false;

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 3000,
    });
    isMongoConnected = true;
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
  } catch (error) {
    isMongoConnected = false;
    console.warn(`[MongoDB] Warning: Real MongoDB not reachable (${error.message}).`);
    console.warn('[MongoDB] Playora will operate in hybrid mode with local memory sync.');
    console.warn('[MongoDB] Set MONGODB_URI in .env to connect to your MongoDB Atlas cluster.');
  }
};

export const getDbStatus = () => ({
  connected: isMongoConnected,
  mode: isMongoConnected ? 'mongodb' : 'in-memory-fallback'
});
