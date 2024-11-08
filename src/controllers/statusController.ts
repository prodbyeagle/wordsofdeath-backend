import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
   const uptime = process.uptime();

   const status = {
      uptime: uptime.toFixed(2),
      message: "Hey! from @prodbyeagle. I see you.",
   };

   res.json(status);
});

export default router;
