// src/controllers/entryController.ts

import { Request, Response } from 'express';
import { connectDB } from '../config/db';
import { log } from '../utils/logger';
import { ulid } from 'ulid';

/**
 * Creates a new entry.
 * @param req - The request object containing the incoming HTTP request.
 * @param res - The response object used to send a response to the client.
 * @returns {Promise<void>}
 */
export const createEntry = async (req: Request, res: Response): Promise<void> => {
   const { entry, type, categories, variation } = req.body;

   if (!entry || !type || !categories || !variation) {
      log("error", "All fields must be filled.");
      res.status(400).send('Error: All fields must be filled.');
      return;
   }

   const mainId = ulid();

   const newEntry = {
      id: mainId,
      entry,
      type,
      categories,
      author: (req.user as any).username,
      authorId: (req.user as any).id,
      timestamp: new Date().toISOString(),
      variation,
   };

   try {
      const database = await connectDB();
      await database.collection('entries').insertOne(newEntry);
      log("info", `New entry created: ${entry} (ID: ${mainId})`);
      res.status(201).send({ message: 'Entry successfully created', entryId: mainId });
   } catch (error) {
      log("error", `Error creating the entry: ${error}`);
      res.status(500).send('Error creating the entry.');
   }
};

/**
 * Retrieves all entries.
 * @param req - The request object containing the incoming HTTP request.
 * @param res - The response object used to send a response to the client.
 * @returns {Promise<void>}
 */
export const getEntries = async (req: Request, res: Response): Promise<void> => {
   try {
      const database = await connectDB();
      const entries = await database.collection('entries')
         .find({})
         .sort({ _id: -1 })
         .toArray();

      log("info", `${entries.length} entries retrieved.`);
      res.status(200).json(entries);
   } catch (error) {
      log("error", `Error retrieving entries: ${error}`);
      res.status(500).send('Error retrieving entries.');
   }
};

/**
 * Retrieves an entry by ID.
 * @param req - The request object containing the incoming HTTP request.
 * @param res - The response object used to send a response to the client.
 * @returns {Promise<void>}
 */
export const getEntryById = async (req: Request, res: Response): Promise<void> => {
   const entryId = req.params.id; // Hier wird die ULID entgegengenommen

   try {
      const database = await connectDB();
      const entry = await database.collection('entries').findOne({ id: entryId });

      if (!entry) {
         log("warn", `Entry not found: ID ${entryId}`);
         res.status(404).send('Entry not found.');
         return;
      }

      log("info", `Entry retrieved: ID ${entryId}`);
      res.status(200).json(entry);
   } catch (error) {
      log("error", `Error retrieving entry: ${error}`);
      res.status(500).send('Error retrieving entry.');
   }
};

/**
 * Deletes an entry by ID.
 * @param req - The request object containing the incoming HTTP request.
 * @param res - The response object used to send a response to the client.
 * @returns {Promise<void>}
 */
export const deleteEntry = async (req: Request, res: Response): Promise<void> => {
   const entryId = req.params.id;

   try {
      const database = await connectDB();
      const result = await database.collection('entries').deleteOne({ id: entryId });

      if (result.deletedCount === 0) {
         log("warn", `Entry not found: ID ${entryId}`);
         res.status(404).send('Entry not found.');
         return;
      }

      log("info", `Entry successfully deleted: ID ${entryId}`);
      res.status(200).send('Entry successfully deleted.');
   } catch (error) {
      log("error", `Error deleting entry: ${error}`);
      res.status(500).send('Error deleting entry.');
   }
};

/**
 * Retrieves entries by author username.
 * @param req - The request object containing the incoming HTTP request.
 * @param res - The response object used to send a response to the client.
 * @returns {Promise<void>}
 */
export const getEntriesByAuthor = async (req: Request, res: Response): Promise<void> => {
   const authorUsername = req.params.username;

   try {
      const database = await connectDB();
      const entries = await database.collection('entries')
         .find({ author: authorUsername })
         .sort({ timestamp: -1 })
         .toArray();

      if (entries.length === 0) {
         log("warn", `No entries found for user: ${authorUsername}`);
         res.status(404).send('No entries found for this user.');
         return;
      }

      log("info", `${entries.length} entries retrieved for user: ${authorUsername}`);
      res.status(200).json(entries);
   } catch (error) {
      log("error", `Error retrieving entries by author: ${error}`);
      res.status(500).send('Error retrieving entries by author.');
   }
};

