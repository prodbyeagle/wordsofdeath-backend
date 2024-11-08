import { Request, Response } from 'express';
import { connectDB } from '../config/db';
import { log } from '../utils/logger';

/**
 * Searches for entries based on the query parameter.
 * @param req - The request object containing the incoming HTTP request.
 * @param res - The response object used to send a response to the client.
 * @returns {Promise<void>}
 */
export const searchEntries = async (req: Request, res: Response): Promise<void> => {
   const query = req.query.q as string;

   if (!query) {
      log("warn", "No search query provided.");
      res.status(400).json({ error: 'No search query provided.' });
      return;
   }

   try {
      const database = await connectDB();
      const words = await database.collection('entries').find({ entry: new RegExp(query, 'i') }).limit(10).toArray();
      const categories = await database.collection('categories').find({}).toArray();

      // log("info", `User Searched for: Words: ${words} / Categories: ${categories}`)

      res.status(200).json({ words, categories });
   } catch (error) {
      log("error", `Error retrieving search results: ${error}`);
      res.status(500).json({ error: 'Error retrieving search results.' });
   }
};
