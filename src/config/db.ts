import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';
import { log } from '../utils/logger';

dotenv.config();

const client = new MongoClient(process.env.MONGODB_URI as string);
let db: Db;

/**
 * Connects to the MongoDB database.
 * If the database is already connected, it returns the existing connection.
 * @returns { Promise<Db> } The MongoDB database instance.
 * @throws { Error } Throws an error if the connection fails.
 */
export const connectDB = async (): Promise<Db> => {
   if (!db) {
      await client.connect();
      db = client.db("wordsofdeath");
      log("info", "[SERVER]: Database connected and whitelist initialized.");
   }
   return db;
};
