// src/controllers/adminController.ts

import { Request, Response } from 'express';
import { connectDB } from '../config/db';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { log } from '../utils/logger';

dotenv.config();

/**
 * Handles the check for user admin authentication.
 * @param req - The request object containing the incoming HTTP request.
 * @param res - The response object used to send a response to the client.
 */
export const checkAdmin = async (req: Request, res: Response) => {
   const token = req.headers.authorization?.split(' ')[1];
   if (!token) {
      log("error", "No token provided");
      return res.status(401).json({ message: 'No token provided.' });
   }

   const secret = process.env.JWT_SECRET;
   if (!secret) {
      log("error", "JWT_SECRET is not defined");
      return res.status(500).json({ message: "Server error: JWT_SECRET is not defined." });
   }

   try {
      const decoded: any = jwt.verify(token, secret);
      const username = decoded.username;

      if (!username) {
         log("error", "Username not found in token");
         return res.status(400).json({ message: "Username is required." });
      }

      const db = await connectDB();

      const user = await db.collection('users').findOne({ username: username });

      if (!user) {
         log("error", `User not found in the database: ${username}`);
         return res.status(404).json({ message: "User not found." });
      }

      if (user.roles && (user.roles.includes("admin") || user.roles.includes("owner"))) {
         return res.json({ isAdmin: true });
      } else {
         log("error", `Access denied: User does not have admin privileges: ${username}`);
         return res.status(403).json({ message: "Access denied: User does not have admin privileges." });
      }
   } catch (error) {
      log("error", `An error occurred while checking admin status: ${error}`);
      res.status(500).json({ message: "An error occurred while checking admin status." });
   }
};
