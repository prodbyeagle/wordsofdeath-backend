import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
   const authHeader = req.headers.authorization;
   const token = authHeader && authHeader.split(' ')[1];

   if (!token) {
      console.error("[SERVER]: Error - No token in Authorization header.");
      res.status(401).send('Unauthorized.'); // sende eine Antwort
      return; // verlasse die Middleware
   }

   jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
         console.error("[SERVER]: Error - Invalid token.");
         res.status(403).send('Invalid token.'); // sende eine Antwort
         return; // verlasse die Middleware
      }

      req.user = user as any; // setze den Benutzer im Request
      next(); // rufe die nächste Middleware auf
   });
};
