import { Router } from 'express';
import { createEntry, getEntries, deleteEntry } from '../controllers/entryController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/api/entries', authenticateToken, createEntry);
router.get('/api/entries', authenticateToken, getEntries);
router.delete('/api/entries/:id', authenticateToken, deleteEntry);

export default router;
