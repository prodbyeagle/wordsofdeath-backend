import { Router } from 'express';
import { createEntry, getEntries, deleteEntry } from '../controllers/entryController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

/**
 * Route to create a new entry.
 * @route POST /api/entries
 * @group Entries - Operations about entries
 * @param {string} entry.body.required - The content of the entry
 * @param {string} type.body.required - The type of the entry
 * @param {Array<string>} categories.body.required - The categories associated with the entry
 * @param {string} variation.body.required - The variation of the entry
 * @returns {object} 201 - The created entry object
 * @returns {Error} 400 - Validation error
 * @returns {Error} 500 - Internal server error
 */
router.post('/api/entries', authenticateToken, createEntry);

/**
 * Route to retrieve all entries.
 * @route GET /api/entries
 * @group Entries - Operations about entries
 * @returns {Array<object>} 200 - An array of entries
 * @returns {Error} 500 - Internal server error
 */
router.get('/api/entries', authenticateToken, getEntries);

/**
 * Route to delete an entry by its ID.
 * @route DELETE /api/entries/{id}
 * @group Entries - Operations about entries
 * @param {string} id.path.required - The ID of the entry to delete
 * @returns {object} 200 - Success message
 * @returns {Error} 404 - Entry not found
 * @returns {Error} 500 - Internal server error
 */
router.delete('/api/entries/:id', authenticateToken, deleteEntry);

export default router;
