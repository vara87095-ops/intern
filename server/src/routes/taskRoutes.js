import express from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getTaskStats
} from '../controllers/taskController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', getTaskStats);
router.get('/', optionalAuth, getTasks);
router.get('/:id', optionalAuth, getTaskById);

// Protected mutation routes
router.post('/', protect, createTask);
router.put('/:id', protect, updateTask);
router.patch('/:id/status', protect, updateTaskStatus);
router.delete('/:id', protect, deleteTask);

export default router;
