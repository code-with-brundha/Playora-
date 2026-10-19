import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config/config.js';
import { connectDB, getDbStatus } from './config/db.js';
import authRoutes from './routes/auth.js';
import roomRoutes from './routes/rooms.js';
import { initSocketManager } from './sockets/socketManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

// Socket.io initialization with CORS
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    db: getDbStatus(),
    version: '1.0.0'
  });
});

// Initialize real-time Socket manager
initSocketManager(io);

// Production static files serving
const distPath = path.join(__dirname, '../../client/dist');
app.use(express.static(distPath));

// Fallback to React index.html in production
app.get('*', (req, res, next) => {
  if (req.url.startsWith('/api')) return next();
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      res.status(200).send('Playora API server running. Run Vite client in development or build client for production.');
    }
  });
});

// Start server
const startServer = async () => {
  await connectDB();
  server.listen(config.port, () => {
    console.log(`===============================================`);
    console.log(`🎮 Playora Game Server running on port ${config.port}`);
    console.log(`🌐 Client dev URL: ${config.clientUrl}`);
    console.log(`💾 Database status: ${getDbStatus().mode}`);
    console.log(`===============================================`);
  });
};

startServer();
