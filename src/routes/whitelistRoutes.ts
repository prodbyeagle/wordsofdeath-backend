import { Router } from 'express';
import { addToWhitelist, getWhitelist, deleteFromWhitelist } from '../controllers/whitelistController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

/**
 * Adds a user to the whitelist.
 * @route POST /api/whitelist
 * @middleware authenticateToken - Middleware to authenticate the token.
 * @param {Request} req - The request object containing the incoming HTTP request.
 * @param {Response} res - The response object used to send a response to the client.
 */
router.post('/api/whitelist', authenticateToken, addToWhitelist);

/**
 * Retrieves all users from the whitelist.
 * @route GET /api/whitelist
 * @middleware authenticateToken - Middleware to authenticate the token.
 * @param {Request} req - The request object containing the incoming HTTP request.
 * @param {Response} res - The response object used to send a response to the client.
 */
router.get('/api/whitelist', authenticateToken, getWhitelist);

/**
 * Deletes a user from the whitelist.
 * @route DELETE /api/whitelist/:username
 * @middleware authenticateToken - Middleware to authenticate the token.
 * @param {Request} req - The request object containing the incoming HTTP request.
 * @param {Response} res - The response object used to send a response to the client.
 */
router.delete('/api/whitelist/:username', authenticateToken, deleteFromWhitelist);

export default router;
