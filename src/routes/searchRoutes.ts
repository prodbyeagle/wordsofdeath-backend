import { Router } from 'express';
import { searchEntries } from '../controllers/searchController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

/**
 * Route to search for entries.
 * @route GET /search
 * @group Search - Operations related to searching entries
 * @param {string} q.query.required - The search query
 * @returns {object} 200 - A list of matching entries and categories
 * @returns {Error} 400 - Query must not be empty
 * @returns {Error} 500 - Error retrieving search results
 */
router.get('/api/search', authenticateToken, searchEntries);

export default router;
