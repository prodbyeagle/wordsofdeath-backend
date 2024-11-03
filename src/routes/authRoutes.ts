import { Router } from 'express';
import { discordAuth, discordCallback } from '../controllers/authController';

const router = Router();

router.get('/auth/discord', discordAuth);
router.get('/auth/discord/callback', discordCallback);

export default router;
