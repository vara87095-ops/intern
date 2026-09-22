import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import projectRoutes from './routes/projectRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend development and production
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
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
app.use('/api/projects', projectRoutes);

// Health check root
app.get('/api', (req, res) => {
  res.json({
    name: 'ProjectHub API',
    version: '1.0.0',
    description: 'REST API for Managing and Showcasing Full-Stack Projects',
    endpoints: {
      health: 'GET /api/projects/health',
      stats: 'GET /api/projects/stats',
      listProjects: 'GET /api/projects',
      getProject: 'GET /api/projects/:id',
      createProject: 'POST /api/projects',
      updateProject: 'PUT /api/projects/:id',
      deleteProject: 'DELETE /api/projects/:id'
    }
  });
});

// Serve frontend build if present (for single-service deployment)
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
  app.listen(PORT, () => {
    console.log(`🚀 ProjectHub Server running on http://localhost:${PORT}`);
    console.log(`📡 API Documentation available at http://localhost:${PORT}/api`);
  });
}

startServer();

export default app;
