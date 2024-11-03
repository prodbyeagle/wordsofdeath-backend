import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import entryRoutes from './routes/entryRoutes';
import whitelistRoutes from './routes/whitelistRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cookieParser());
app.use(session({
   secret: process.env.JWT_SECRET || 'secret',
   resave: false,
   saveUninitialized: true,
}));

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// Routen
app.use(authRoutes);
app.use(entryRoutes);
app.use(whitelistRoutes);

app.listen(PORT, () => {
   console.log(`[SERVER]: Listening on port ${PORT}`);
});

export default app;
