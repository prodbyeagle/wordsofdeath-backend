import { Router } from 'express';
import { createEntry, getEntries, getEntryById, deleteEntry, getEntriesByAuthor } from '../controllers/entryController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

/**
 * Route to create a new entry.
 * @route POST /api/entries
 * @group Entries - Operations about entries
 * @param {string} entry.body.required - The content of the entry
 * @param {Array<string>} categories.body.required - The categories associated with the entry
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
 * Route to retrieve an entry by its ID.
 * @route GET /api/entries/{id}
 * @group Entries - Operations about entries
 * @param {string} id.path.required - The ID of the entry to retrieve
 * @returns {object} 200 - The entry object
 * @returns {Error} 404 - Entry not found
 * @returns {Error} 500 - Internal server error
 */
router.get('/api/entries/:id', authenticateToken, getEntryById);

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

/**
 * Route to retrieve entries by author username.
 * @route GET /api/entries/byAuthor/{username}
 * @group Entries - Operations about entries
 * @param {string} username.path.required - The username of the entry's author
 * @returns {Array<object>} 200 - An array of entries by the specified author
 * @returns {Error} 404 - No entries found for this user
 * @returns {Error} 500 - Internal server error
 */
router.get('/api/entries/u/:username', authenticateToken, getEntriesByAuthor);

export default router;
