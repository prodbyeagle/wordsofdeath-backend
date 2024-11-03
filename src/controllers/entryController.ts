import { Request, Response } from 'express';
import { connectDB } from '../config/db';
import { ObjectId } from 'mongodb';

/**
 * Erstellt einen neuen Eintrag.
 */
export const createEntry = async (req: Request, res: Response): Promise<void> => {
   const { entry, type, categories, variation } = req.body;

   if (!entry || !type || !categories || !variation) {
      console.log("[SERVER]: Error - All fields must be filled.");
      res.status(400).send('Error: All fields must be filled.');
      return;
   }

   const newEntry = {
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
      const result = await database.collection('entries').insertOne(newEntry);
      console.log(`[SERVER]: New entry created: ${entry} (ID: ${result.insertedId})`);
      res.status(201).send({ message: 'Entry successfully created', entryId: result.insertedId });
   } catch (error) {
      console.error('[SERVER]: Error creating the entry:', error);
      res.status(500).send('Error creating the entry.');
   }
};

/**
 * Ruft alle Einträge ab.
 */
export const getEntries = async (req: Request, res: Response): Promise<void> => {
   try {
      const database = await connectDB();
      const entries = await database.collection('entries').find({}).toArray();

      console.log(`[SERVER]: ${entries.length} entries retrieved.`);
      res.status(200).json(entries);
   } catch (error) {
      console.error('[SERVER]: Error retrieving entries:', error);
      res.status(500).send('Error retrieving entries.');
   }
};

/**
 * Löscht einen Eintrag anhand der ID.
 */
export const deleteEntry = async (req: Request, res: Response): Promise<void> => {
   const entryId = req.params.id;

   try {
      const database = await connectDB();
      const result = await database.collection('entries').deleteOne({ _id: new ObjectId(entryId) });

      if (result.deletedCount === 0) {
         res.status(404).send('Entry not found.');
         return;
      }

      res.status(200).send('Entry successfully deleted.');
   } catch (error) {
      console.error('[SERVER]: Error deleting entry:', error);
      res.status(500).send('Error deleting entry.');
   }
};
