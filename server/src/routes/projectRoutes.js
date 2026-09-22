import express from 'express';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getStats,
  getHealth
} from '../controllers/projectController.js';

const router = express.Router();

// Health check endpoint
router.get('/health', getHealth);

// Aggregated stats endpoint
router.get('/stats', getStats);

// Project CRUD endpoints
router.route('/')
  .get(getProjects)
  .post(createProject);

router.route('/:id')
  .get(getProjectById)
  .put(updateProject)
  .delete(deleteProject);

export default router;
