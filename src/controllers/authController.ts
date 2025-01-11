// src/controllers/authController.ts

import { Request, Response } from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { connectDB } from '../config/db';
import { log } from '../utils/logger';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID as string;
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET as string;
const REDIRECT_URI = `${process.env.SERVER_URL}/auth/discord/callback`;

/**
 * Redirects the user to the Discord authentication page.
 * @param req - The request object containing the incoming HTTP request.
 * @param res - The response object used to send a response to the client.
 */
export const discordAuth = (req: Request, res: Response) => {
   const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=identify`;
   log("info", "Redirecting user to Discord authentication page.");
   res.redirect(discordAuthUrl);
};

/**
 * Handles the callback from Discord after user authentication.
 * @param req - The request object containing the incoming HTTP request.
 * @param res - The response object used to send a response to the client.
 * @returns {Promise<void>}
 */
export const discordCallback = async (req: Request, res: Response): Promise<void> => {
   log("info", "Starting Discord callback process.");
   const { code, error, error_description } = req.query;

   if (error === 'access_denied') {
      log("warn", `Authentication error from Discord: ${error_description}`);
      res.status(403).send(`Access denied: ${error_description}`);
      return;
   }

   if (!code) {
      log("error", "No authorization code received from Discord.");
      res.status(400).send('Error: No code received.');
      return;
   }

   try {
      log("info", "Attempting to retrieve Discord access token.");
      const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
         client_id: DISCORD_CLIENT_ID,
         client_secret: DISCORD_CLIENT_SECRET,
         code: code as string,
         grant_type: 'authorization_code',
         redirect_uri: REDIRECT_URI,
         scope: 'identify',
      }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });

      const { access_token } = tokenResponse.data;
      log("debug", `Access token received: ${access_token}`);

      log("info", "Fetching user info from Discord.");
      const userInfoResponse = await axios.get('https://discord.com/api/users/@me', {
         headers: { Authorization: `Bearer ${access_token}` },
      });

      const { username, avatar, id } = userInfoResponse.data;
      log("debug", `Discord user info received: ${JSON.stringify({ username, avatar, id })}`);

      log("info", "Connecting to database to check whitelist.");
      const database = await connectDB();
      const userInWhitelist = await database.collection('whitelist').findOne({ username });

      if (!userInWhitelist) {
         log("warn", `User ${username} is not on the whitelist.`);
         res.redirect(403, 'https://wordsofdeath.vercel.app/access-denied');
         return;
      }

      const usersCollection = database.collection('users');
      const existingUser = await usersCollection.findOne({ id });

      if (!existingUser) {
         await usersCollection.insertOne({
            id,
            username,
            avatar,
            joined_at: new Date(),
         });
         log("info", `New user added to the database: ${username}`);
      } else {
         if (existingUser.avatar !== avatar) {
            log("info", `Updating avatar for user ${username} as it has changed.`);
            await usersCollection.updateOne({ id }, { $set: { avatar } });
         } else {
            log("info", `Avatar for user ${username} is up-to-date.`);
         }
      }

      const token = jwt.sign({ username, avatar, id }, JWT_SECRET);
      log("info", "Returning JWT token to client for LocalStorage.");

      res.redirect(`${process.env.CLIENT_URL}/signin/callback?token=${token}`);

      log("info", `User ${username} authenticated successfully. Redirecting to client.`);
   } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
         log("error", `Error during Discord authentication (Axios): ${error.response?.data}`);
      } else if (error instanceof Error) {
         log("error", `Error during Discord authentication: ${error.message}`);
      } else {
         log("error", `Unexpected error during Discord authentication: ${String(error)}`);
      }
      res.status(500).send('Error during authentication');
   }
};
