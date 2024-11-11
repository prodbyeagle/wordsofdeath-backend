// src/controllers/categoryController.ts

import { Request, Response } from 'express';
import { connectDB } from '../config/db';
import { log } from '../utils/logger';

/**
 * Retrieves entries by category name.
 * @param req - The request object containing the incoming HTTP request.
 * @param res - The response object used to send a response to the client.
 * @returns {Promise<void>}
 */
export const fetchEntriesByCategory = async (req: Request, res: Response): Promise<void> => {
   const { name } = req.params;
   if (!name) {
      log("error", "Category name is required.");
      res.status(400).send('Category name is required.');
      return;
   }

   try {
      const database = await connectDB();
      const entries = await database.collection('entries').find({ categories: name }).toArray();

      if (entries.length === 0) {
         log("warn", `No entries found for category: ${name}`);
         res.status(404).send('No entries found for this category.');
         return;
      }

      log("info", `${entries.length} entries retrieved for category: ${name}`);

//max. 3 entries
      res.status(200).json(entries);
   } catch (error) {
      log("error", `Error fetching entries for category: ${error}`);
      res.status(500).send('Error fetching entries for this category.');
   }
};
