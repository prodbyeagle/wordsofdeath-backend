// src/controllers/userController.ts
import { Request, Response } from 'express';
import { connectDB } from '../config/db';
import { log } from '../utils/logger';

const userCache: { [key: string]: { data: any; expiresAt: number } } = {};
const CACHE_DURATION_MS = 30 * 60 * 1000;

/**
 * Retrieves a user by their ID.
 * @param req - The request object containing the user's ID.
 * @param res - The response object used to send the user data.
 * @returns {Promise<void>}
 */
export const getUserById = async (req: Request, res: Response): Promise<void> => {
   const userId = req.params.id;

   const cachedUser = userCache[userId];
   if (cachedUser && cachedUser.expiresAt > Date.now()) {
      res.status(200).json(cachedUser.data);
      return;
   }

   try {
      const database = await connectDB();
      const user = await database.collection('users').findOne({ id: userId });

      if (!user) {
         log("error", `User with ID ${userId} not found.`);
         res.status(404).send('User not found');
         return;
      }

      userCache[userId] = {
         data: user,
         expiresAt: Date.now() + CACHE_DURATION_MS,
      };

      res.status(200).json(user);
   } catch (error) {
      log("error", `Error retrieving user by ID: ${error}`);
      res.status(500).send('Error retrieving user.');
   }
};

/**
 * Retrieves a user by their username.
 * @param req - The request object containing the username.
 * @param res - The response object used to send the user data.
 * @returns {Promise<void>}
 */
export const getUserByUsername = async (req: Request, res: Response): Promise<void> => {
   const username = req.params.username;

   const cachedUser = userCache[username];
   if (cachedUser && cachedUser.expiresAt > Date.now()) {
      res.status(200).json(cachedUser.data);
      return;
   }

   try {
      const database = await connectDB();
      const user = await database.collection('users').findOne({ username });

      if (!user) {
         log("error", `User with username ${username} not found.`);
         res.status(404).send('User not found');
         return;
      }

      userCache[username] = {
         data: user,
         expiresAt: Date.now() + CACHE_DURATION_MS,
      };

      res.status(200).json(user);
   } catch (error) {
      log("error", `Error retrieving user by username: ${error}`);
      res.status(500).send('Error retrieving user.');
   }
};