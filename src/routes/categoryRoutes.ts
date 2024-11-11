// src/routes/categoryRoutes.ts

import { Router } from 'express';
import { fetchEntriesByCategory } from '../controllers/categoryController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

/**
 * Retrieves entries by category name.
 * @route GET /api/categories/:name
 * @middleware authenticateToken - Middleware to authenticate the token.
 * @param {Request} req - The request object containing the incoming HTTP request.
 * @param {Response} res - The response object used to send a response to the client.
 */
router.get('/api/categories/:name', authenticateToken, fetchEntriesByCategory);

export default router;
