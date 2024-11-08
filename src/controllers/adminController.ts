// src/controllers/adminController.ts

import { Request, Response } from 'express';
import { connectDB } from '../config/db';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { log } from '../utils/logger';

dotenv.config();

/**
 * Handles the Check from the User for admin authentication.
 * @param req - The request object containing the incoming HTTP request.
 * @param res - The response object used to send a response to the client.
 */
export const checkAdmin = async (req: Request, res: Response) => {
   log("debug", `Full request query object: ${JSON.stringify(req.query)}`);

   const token = req.headers.authorization?.split(' ')[1];
   if (!token) {
      log("warn", "No token provided");
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

      log("debug", `Received request to check admin status for: ${username}`);

      if (!username) {
         log("warn", "Username not found in token");
         return res.status(400).json({ message: "Username is required." });
      }

      const db = await connectDB();
      log("debug", "Connected to the database");

      const user = await db.collection('users').findOne({ username: username });
      log("debug", `Retrieved user from database: ${JSON.stringify(user)}`);

      if (user) {
         log("debug", `User roles: ${user.roles}`);
      } else {
         log("warn", `User not found in the database: ${username}`);
         return res.status(404).json({ message: "User not found." });
      }

      if (user.roles && user.roles.includes("admin")) {
         log("info", `User is an admin: ${username}`);
         return res.json({ isAdmin: true });
      } else {
         log("info", `Access denied: User is not an admin: ${username}`);
         return res.status(403).json({ message: "Access denied: User is not an admin." });
      }
   } catch (error) {
      log("error", `An error occurred while checking admin status: ${error}`);
      res.status(500).json({ message: "An error occurred while checking admin status." });
   }
};
