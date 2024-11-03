// src/routes/adminRoutes.ts

import { Router, Request, Response, NextFunction } from 'express';
import { checkAdmin } from '../controllers/adminController';

const router = Router();

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
   (req: Request, res: Response, next: NextFunction) => {
      fn(req, res, next).catch(next);
   };

router.get('/api/check-admin', asyncHandler(checkAdmin));

export default router;
