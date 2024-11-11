// src/controllers/userController.ts
import { Request, Response } from 'express';
import { connectDB } from '../config/db';
import { log } from '../utils/logger';

/**
 * Retrieves a user by their ID.
 * @param req - The request object containing the user's ID.
 * @param res - The response object used to send the user data.
 * @returns {Promise<void>}
 */
export const getUserById = async (req: Request, res: Response): Promise<void> => {
   const userId = req.params.id;

   try {
      const database = await connectDB();
      const user = await database.collection('users').findOne({ id: userId });

      if (!user) {
         log("error", `User with ID ${userId} not found.`);
         res.status(404).send('User not found');
         return;
      }

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

   try {
      const database = await connectDB();
      const user = await database.collection('users').findOne({ username });

      if (!user) {
         log("error", `User with username ${username} not found.`);
         res.status(404).send('User not found');
         return;
      }

      res.status(200).json(user);
   } catch (error) {
      log("error", `Error retrieving user by username: ${error}`);
      res.status(500).send('Error retrieving user.');
   }
};
