import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes';
import entryRoutes from './routes/entryRoutes';
import whitelistRoutes from './routes/whitelistRoutes';
import statusRoutes from './controllers/statusController';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 6969;

app.use(cookieParser());
app.use(session({
   secret: process.env.JWT_SECRET || 'secret',
   resave: false,
   saveUninitialized: true,
}));

app.use(express.json());
app.use(cors({
   origin: process.env.CLIENT_URL,
   credentials: true
}));

app.use(authRoutes);
app.use(entryRoutes);
app.use(whitelistRoutes);
app.use(statusRoutes);

app.listen(PORT, () => {
   console.log(`[SERVER]: Listening on port ${PORT}`);
});

export default app;
