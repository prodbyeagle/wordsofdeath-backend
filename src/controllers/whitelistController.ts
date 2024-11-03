import { Request, Response } from 'express';
import { connectDB } from '../config/db';

/**
 * Fügt einen Benutzer zur Whitelist hinzu.
 */
export const addToWhitelist = async (req: Request, res: Response): Promise<void> => {
   const { username } = req.body;
   if (!username) {
      res.status(400).send('Username is required.'); // sende eine Antwort
      return; // verlasse die Funktion
   }

   try {
      const database = await connectDB();
      const existingUser = await database.collection('whitelist').findOne({ username });
      if (existingUser) {
         res.status(400).send('User is already on the whitelist.'); // sende eine Antwort
         return; // verlasse die Funktion
      }

      const result = await database.collection('whitelist').insertOne({ username, added_at: new Date() });
      res.status(201).send({ id: result.insertedId, username, added_at: new Date() });
   } catch (error) {
      console.error('[SERVER]: Error adding user to whitelist:', error);
      res.status(500).send('Error adding user to whitelist.'); // sende eine Antwort
   }
};

/**
 * Ruft die Whitelist-Benutzer ab.
 */
export const getWhitelist = async (req: Request, res: Response): Promise<void> => {
   try {
      const database = await connectDB();
      const users = await database.collection('whitelist').find({}).toArray();
      res.status(200).json(users);
   } catch (error) {
      console.error('[SERVER]: Error retrieving whitelist users:', error);
      res.status(500).send('Error retrieving whitelist users.'); // sende eine Antwort
   }
};

/**
 * Entfernt einen Benutzer von der Whitelist.
 */
export const deleteFromWhitelist = async (req: Request, res: Response): Promise<void> => {
   const username = req.params.username;

   try {
      const database = await connectDB();
      const result = await database.collection('whitelist').deleteOne({ username });

      if (result.deletedCount === 0) {
         res.status(404).json({ message: "User not found." }); // sende eine Antwort
         return; // verlasse die Funktion
      }

      res.status(200).json({ message: "User successfully removed." });
   } catch (error) {
      console.error('[SERVER]: Error removing user from whitelist:', error);
      res.status(500).json({ message: "Internal server error." }); // sende eine Antwort
   }
};
