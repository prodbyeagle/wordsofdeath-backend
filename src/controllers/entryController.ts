// src/controllers/entryController.ts

import { Request, Response } from 'express';
import { connectDB } from '../config/db';
import { log } from '../utils/logger';
import { ulid } from 'ulid';
import axios from 'axios';

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK;

/**
 * Creates a new entry.
 * @param req - The request object containing the incoming HTTP request.
 * @param res - The response object used to send a response to the client.
 * @returns {Promise<void>}
 */
export const createEntry = async (req: Request, res: Response): Promise<void> => {
   const { entry, categories, timestamp, author, authorId } = req.body;

   if (!entry || !categories) {
      log('error', 'Validation failed: Missing required fields.');
      res.status(400).send('Error: All fields must be filled.');
      return;
   }

   const mainId = ulid();

   const newEntry = {
      id: mainId,
      entry,
      categories,
      author: author || (req.user as any)?.username,
      authorId: authorId || (req.user as any)?.id,
      timestamp: timestamp || new Date().toISOString(),
   };

   try {
      const database = await connectDB();

      const existingEntry = await database.collection('entries').findOne({ entry });
      if (existingEntry) {
         log('error', `Duplicate entry detected: ${entry}`);
         res.status(409).send('Error: Duplicate entry. This entry already exists.');
         return;
      }

      await database.collection('entries').insertOne(newEntry);

      if (DISCORD_WEBHOOK_URL) {
         const embed = {
            embeds: [
               {
                  title: `✅ Hamma! <- Zum Eintrag.`,
                  description: `**${entry}** wurde erstellt!`,
                  color: 0x1e90ff,
                  fields: [
                     {
                        name: 'Ersteller',
                        value: author || (req.user as any)?.username || 'Unbekannter User',
                        inline: false,
                     },
                     {
                        name: 'Kategorien',
                        value: categories.join(', '),
                        inline: false,
                     },
                  ],
                  timestamp: new Date().toISOString(),
                  url: `https://wordsofdeath.vercel.app/e/${mainId}`,
               },
            ],
         };

         await axios.post(DISCORD_WEBHOOK_URL, embed);
      }

      res.status(201).send({ message: 'Entry successfully created', entryId: mainId });
   } catch (error) {
      if (error instanceof Error) {
         log('error', `Error creating the entry: ${error.message}`);
      } else {
         log('error', 'Error creating the entry: Unknown error type.');
      }
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
   const entryId = req.params.id;

   try {
      const database = await connectDB();
      const entry = await database.collection('entries').findOne({ id: entryId });

      if (!entry) {
         log("error", `Entry not found: ID ${entryId}`);
         res.status(404).send('Entry not found.');
         return;
      }

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
         log("error", `Entry not found: ID ${entryId}`);
         res.status(404).send('Entry not found.');
         return;
      }

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
         log("error", `No entries found for user: ${authorUsername}`);
         res.status(404).send('No entries found for this user.');
         return;
      }

      res.status(200).json(entries);
   } catch (error) {
      log("error", `Error retrieving entries by author: ${error}`);
      res.status(500).send('Error retrieving entries by author.');
   }
};
