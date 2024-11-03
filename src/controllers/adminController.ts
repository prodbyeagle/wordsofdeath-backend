// src/controllers/adminController.ts

import { Request, Response } from 'express';
import { connectDB } from '../config/db';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

export const checkAdmin = async (req: Request, res: Response) => {
   console.log("[DEBUG] Full request query object:", req.query);

   const token = req.headers.authorization?.split(' ')[1];
   if (!token) {
      console.warn("[WARN] No token provided");
      return res.status(401).json({ message: 'No token provided.' });
   }

   const secret = process.env.JWT_SECRET;
   if (!secret) {
      console.error("[ERROR] JWT_SECRET is not defined");
      return res.status(500).json({ message: "Server error: JWT_SECRET is not defined." });
   }

   try {
      const decoded: any = jwt.verify(token, secret);
      const username = decoded.username;

      console.log("[DEBUG] Received request to check admin status for:", username);

      if (!username) {
         console.warn("[WARN] Username not found in token");
         return res.status(400).json({ message: "Username is required." });
      }

      const db = await connectDB();
      console.log("[DEBUG] Connected to the database");

      const user = await db.collection('users').findOne({ username: username });
      console.log("[DEBUG] Retrieved user from database:", user);

      if (user) {
         console.log("[DEBUG] User roles:", user.roles);
      } else {
         console.warn("[WARN] User not found in the database:", username);
         return res.status(404).json({ message: "User not found." });
      }

      if (user.roles && user.roles.includes("admin")) {
         console.log("[INFO] User is an admin:", username);
         return res.json({ isAdmin: true });
      } else {
         console.info("[INFO] Access denied: User is not an admin:", username);
         return res.status(403).json({ message: "Access denied: User is not an admin." });
      }
   } catch (error) {
      console.error("[ERROR] An error occurred while checking admin status:", error);
      res.status(500).json({ message: "An error occurred while checking admin status." });
   }
};
