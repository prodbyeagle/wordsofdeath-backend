import { Request, Response } from 'express';
import { connectDB } from '../config/db';

/**
 * Adds a user to the whitelist.
 * @param req - The request object containing the incoming HTTP request.
 * @param res - The response object used to send a response to the client.
 * @returns {Promise<void>}
 */
export const addToWhitelist = async (req: Request, res: Response): Promise<void> => {
   const { username } = req.body;
   if (!username) {
      res.status(400).send('Username is required.');
      return;
   }

   try {
      const database = await connectDB();
      const existingUser = await database.collection('whitelist').findOne({ username });
      if (existingUser) {
         res.status(400).send('User is already on the whitelist.');
         return;
      }

      const result = await database.collection('whitelist').insertOne({ username, added_at: new Date() });
      res.status(201).send({ id: result.insertedId, username, added_at: new Date() });
   } catch (error) {
      console.error('[SERVER]: Error adding user to whitelist:', error);
      res.status(500).send('Error adding user to whitelist.');
   }
};

/**
 * Retrieves the whitelist users.
 * @param req - The request object containing the incoming HTTP request.
 * @param res - The response object used to send a response to the client.
 * @returns {Promise<void>}
 */
export const getWhitelist = async (req: Request, res: Response): Promise<void> => {
   try {
      const database = await connectDB();
      const users = await database.collection('whitelist').find({}).toArray();
      res.status(200).json(users);
   } catch (error) {
      console.error('[SERVER]: Error retrieving whitelist users:', error);
      res.status(500).send('Error retrieving whitelist users.');
   }
};

/**
 * Removes a user from the whitelist.
 * @param req - The request object containing the incoming HTTP request.
 * @param res - The response object used to send a response to the client.
 * @returns {Promise<void>}
 */
export const deleteFromWhitelist = async (req: Request, res: Response): Promise<void> => {
   const username = req.params.username;

   try {
      const database = await connectDB();
      const result = await database.collection('whitelist').deleteOne({ username });

      if (result.deletedCount === 0) {
         res.status(404).json({ message: "User not found." });
         return;
      }

      res.status(200).json({ message: "User successfully removed." });
   } catch (error) {
      console.error('[SERVER]: Error removing user from whitelist:', error);
      res.status(500).json({ message: "Internal server error." });
   }
};
