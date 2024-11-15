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
   const { entry, type, categories, variation, timestamp, author, authorId } = req.body;

   if (!entry || !type || !categories || !variation) {
      log('error', 'All fields must be filled.');
      res.status(400).send('Error: All fields must be filled.');
      return;
   }

   const mainId = ulid();

   const newEntry = {
      id: mainId,
      entry,
      type,
      categories,
      author: author || (req.user as any).username,
      authorId: authorId || (req.user as any).id,
      timestamp: timestamp || new Date().toISOString(),
      variation,
   };

   try {
      const database = await connectDB();

      const existingEntry = await database.collection('entries').findOne({ entry });

      if (existingEntry) {
         log('error', `Entry already exists: ${entry}`);
         res.status(409).send('Error: Duplicate entry. This entry already exists.');
         return;
      }

      await database.collection('entries').insertOne(newEntry);
      log('info', `New entry created: ${entry} (ID: ${mainId})`);

      if (DISCORD_WEBHOOK_URL) {
         const embed = {
            embeds: [
               {
                  title: `🚀 New Entry Created!`,
                  description: `**${entry}** was created!`,
                  color: 0x1e90ff,
                  fields: [
                     {
                        name: 'Author',
                        value: author || (req.user as any).username || 'Unknown',
                        inline: true,
                     },
                     {
                        name: 'Type',
                        value: type,
                        inline: true,
                     },
                     {
                        name: 'Categories',
                        value: categories.join(', '),
                        inline: false,
                     },
                  ],
                  footer: {
                     text: `Entry ID: ${mainId}`,
                  },
                  timestamp: new Date().toISOString(),
                  url: `https://wordsofdeath.vercel.app/e/${mainId}`,
               },
            ],
         };

         await axios.post(DISCORD_WEBHOOK_URL, embed);
         log('info', 'Discord webhook with embed sent successfully.');
      } else {
         log('warn', 'Discord webhook URL is not configured.');
      }

      res.status(201).send({ message: 'Entry successfully created', entryId: mainId });
   } catch (error) {
      log('error', `Error creating the entry: ${error}`);
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
   const entryId = req.params.id;

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

/**
 * Retrieves metadata for an entry by ID.
 * @param req - The request object containing the incoming HTTP request.
 * @param res - The response object used to send a response to the client.
 * @returns {Promise<void>}
 */
export const getEntryMetadata = async (req: Request, res: Response): Promise<void> => {
   const entryId = req.params.id;

   try {
      const database = await connectDB();
      const entry = await database.collection('entries').findOne(
         { id: entryId },
         {
            projection: {
               id: 1,
               entry: 1,
               type: 1,
               categories: 1,
               author: 1,
               timestamp: 1,
            },
         }
      );

      if (!entry) {
         log("warn", `Metadata not found for entry: ID ${entryId}`);
         res.status(404).send('Metadata not found.');
         return;
      }

      log("info", `Metadata retrieved for entry: ID ${entryId}`);
      res.status(200).json(entry);
   } catch (error) {
      log("error", `Error retrieving metadata: ${error}`);
      res.status(500).send('Error retrieving metadata.');
   }
};