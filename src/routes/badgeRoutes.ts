import { Router } from 'express';
import { addBadgeToUser, removeBadgeFromUser, getBadgesFromUser } from '../controllers/badgeController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

/**
 * Route to add a badge (role) to a user.
 * @route POST /api/users/{username}/badges
 * @group Badges - Operations related to user badges
 * @param {string} username.path.required - The username of the user to update.
 * @param {string} role.body.required - The role to assign to the user (e.g., 'owner', 'admin', 'vip').
 * @returns {object} 200 - The updated user object with the new role.
 * @returns {Error} 400 - Invalid role or user not found.
 * @returns {Error} 500 - Internal server error.
 */
router.post('/api/badges/:username', authenticateToken, addBadgeToUser);

/**
 * Route to remove a badge (role) from a user.
 * @route DELETE /api/users/{username}/badges
 * @group Badges - Operations related to user badges
 * @param {string} username.path.required - The username of the user to update.
 * @param {string} role.body.required - The role to remove from the user.
 * @returns {object} 200 - The updated user object without the removed role.
 * @returns {Error} 400 - Invalid role or user not found.
 * @returns {Error} 500 - Internal server error.
 */
router.delete('/api/badges/:username', authenticateToken, removeBadgeFromUser);

/**
 * Route to get the badges (roles) of a user.
 * @route GET /api/users/{username}/badges
 * @group Badges - Operations related to user badges
 * @param {string} username.path.required - The username to retrieve badges for.
 * @returns {Array<string>} 200 - An array of badges (roles) assigned to the user.
 * @returns {Error} 404 - User not found.
 * @returns {Error} 500 - Internal server error.
 */
router.get('/api/badges/:username', authenticateToken, getBadgesFromUser);

export default router;
