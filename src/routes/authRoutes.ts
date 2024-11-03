import { Router } from 'express';
import { discordAuth, discordCallback } from '../controllers/authController';

const router = Router();

/**
 * Route to initiate Discord authentication.
 * @route GET /auth/discord
 * @group Authentication - Operations related to user authentication
 * @returns {object} 302 - Redirects to the Discord authentication page
 */
router.get('/auth/discord', discordAuth);

/**
 * Route to handle the callback from Discord after authentication.
 * @route GET /auth/discord/callback
 * @group Authentication - Operations related to user authentication
 * @returns {object} 302 - Redirects to the main application
 * @returns {Error} 400 - No code received error
 * @returns {Error} 403 - User not on the whitelist
 * @returns {Error} 500 - Internal server error
 */
router.get('/auth/discord/callback', discordCallback);

export default router;
