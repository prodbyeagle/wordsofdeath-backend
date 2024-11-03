import { Request, Response } from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { connectDB } from '../config/db';

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
   console.log("[SERVER]: Redirecting user to Discord authentication page.");
   res.redirect(discordAuthUrl);
};

/**
 * Handles the callback from Discord after user authentication.
 * @param req - The request object containing the incoming HTTP request.
 * @param res - The response object used to send a response to the client.
 * @returns {Promise<void>}
 */
export const discordCallback = async (req: Request, res: Response): Promise<void> => {
   const { code } = req.query;

   if (!code) {
      console.error("[SERVER]: Error - No code received.");
      res.status(400).send('Error: No code received.');
      return;
   }

   try {
      const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
         client_id: DISCORD_CLIENT_ID,
         client_secret: DISCORD_CLIENT_SECRET,
         code: code as string,
         grant_type: 'authorization_code',
         redirect_uri: REDIRECT_URI,
         scope: 'identify',
      }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });

      const { access_token } = tokenResponse.data;

      const userInfoResponse = await axios.get('https://discord.com/api/users/@me', {
         headers: { Authorization: `Bearer ${access_token}` },
      });

      const { username, avatar, id } = userInfoResponse.data;

      const database = await connectDB();
      const userInWhitelist = await database.collection('whitelist').findOne({ username });

      if (!userInWhitelist) {
         console.warn("[SERVER]: Error - User not on the whitelist.");
         res.status(403).send('Error: User not on the whitelist.');
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
      }

      const token = jwt.sign({ username, avatar, id }, JWT_SECRET, { expiresIn: '1d' });
      res.cookie('wod_token', token, {
         maxAge: 24 * 60 * 60 * 1000,
         sameSite: 'lax',
      });
      console.log("[SERVER]: User successfully authenticated and redirected to the application.");
      res.redirect('https://wordsofdeath.vercel.app/');
   } catch (error) {
      console.error('[SERVER]: Error during Discord authentication:', error);
      res.status(500).send('Error during authentication');
   }
};
