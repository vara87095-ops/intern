import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import projectRoutes from './routes/projectRoutes.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import { initSocket } from './socket/socketHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const httpServer = http.createServer(app);

// Setup Socket.io for Real-time bi-directional events
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
  }
});

initSocket(io);

const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging in development
app.use((req, res, next) => {
  const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/projects', projectRoutes);

// Health check and API documentation root
app.get('/api', (req, res) => {
  res.json({
    name: 'ProjectHub & TaskFlow API',
    version: '2.0.0',
    description: 'Full-stack REST API with JWT Auth, Task CRUD, and WebSockets',
    features: [
      'User Authentication & RBAC (JWT + Bcrypt)',
      'Task CRUD & Sprint Metrics',
      'Real-time WebSocket Synchronization (Socket.io)',
      'Dual Storage (MongoDB Atlas + Zero-config Local Store)'
    ],
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me',
        users: 'GET /api/auth/users'
      },
      tasks: {
        list: 'GET /api/tasks',
        stats: 'GET /api/tasks/stats',
        get: 'GET /api/tasks/:id',
        create: 'POST /api/tasks',
        update: 'PUT /api/tasks/:id',
        updateStatus: 'PATCH /api/tasks/:id/status',
        delete: 'DELETE /api/tasks/:id'
      },
      projects: {
        health: 'GET /api/projects/health',
        stats: 'GET /api/projects/stats',
        list: 'GET /api/projects',
        get: 'GET /api/projects/:id',
        create: 'POST /api/projects',
        update: 'PUT /api/projects/:id',
        delete: 'DELETE /api/projects/:id'
      }
    }
  });
});

// Serve frontend build if present
const clientDistPath = path.join(__dirname, '..', '..', 'client', 'dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    return next();
  }
  const indexPath = path.join(clientDistPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(404).json({ error: 'Endpoint not found or frontend not built yet' });
    }
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Connect to Database and start server
async function startServer() {
  await connectDB();
  httpServer.listen(PORT, () => {
    console.log(`🚀 ProjectHub & TaskFlow Server running on http://localhost:${PORT}`);
    console.log(`📡 API Documentation available at http://localhost:${PORT}/api`);
    console.log(`⚡ WebSocket Server active on ws://localhost:${PORT}`);
  });
}

startServer();

export { app, httpServer, io };
