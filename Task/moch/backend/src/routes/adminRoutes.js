import express from 'express';
import {
  getAllOrders,
  updateOrderStatus,
  getDashboardStats,
  getAllUsers,
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply protect & adminOnly to all routes in this router
router.use(protect, adminOnly);

router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);

export default router;
