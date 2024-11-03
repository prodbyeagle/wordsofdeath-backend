import { Router } from 'express';
import { addToWhitelist, getWhitelist, deleteFromWhitelist } from '../controllers/whitelistController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/api/whitelist', authenticateToken, addToWhitelist);
router.get('/api/whitelist', authenticateToken, getWhitelist);
router.delete('/api/whitelist/:username', authenticateToken, deleteFromWhitelist);

export default router;
