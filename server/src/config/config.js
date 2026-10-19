import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5174',
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/playora',
  jwtSecret: process.env.JWT_SECRET || 'playora-super-secret-jwt-key-2025',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  nodeEnv: process.env.NODE_ENV || 'development'
};
