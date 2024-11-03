import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const client = new MongoClient(process.env.MONGODB_URI as string);
let db: Db;

export const connectDB = async (): Promise<Db> => {
   if (!db) {
      await client.connect();
      db = client.db("wordsofdeath");
      console.log("[SERVER]: Database connected and whitelist initialized.");
   }
   return db;
};
