// src/routes/userRoutes.ts
import { Router } from 'express';
import { getUserById, getUserByUsername } from '../controllers/userController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

/**
 * Get user by ID.
 * @route GET /user/:id
 * @returns {object} 200 - User object
 * @returns {Error} 404 - User not found
 * @returns {Error} 500 - Internal server error
 */
router.get('/api/user/i/:id', authenticateToken, getUserById);

/**
 * Get user by username.
 * @route GET /user/username/:username
 * @returns {object} 200 - User object
 * @returns {Error} 404 - User not found
 * @returns {Error} 500 - Internal server error
 */
router.get('/api/user/u/:username', authenticateToken, getUserByUsername);

export default router;
