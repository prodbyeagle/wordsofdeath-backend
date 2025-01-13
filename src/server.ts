import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes';
import badgeRoutes from './routes/badgeRoutes';
import entryRoutes from './routes/entryRoutes';
import adminRoutes from './routes/adminRoutes';
import userRoutes from './routes/userRoutes';
import whitelistRoutes from './routes/whitelistRoutes';
import { initializeLogger, log } from './utils/logger';
import statusRoutes from './controllers/statusController';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 6969;
const DEBUG = process.env.DEBUG === 'true';

initializeLogger(DEBUG);

const allowedOrigins = [
   'https://wordsofdeath-backend.vercel.app',
   'https://wordsofdeath.vercel.app',
   'http://localhost:3000',
   'http://localhost:3001'
];

const corsOptions: cors.CorsOptions = {
   origin: allowedOrigins,
   credentials: true,
   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(session({
   secret: process.env.JWT_SECRET || 'secret',
   resave: false,
   saveUninitialized: true,
}));

app.use(authRoutes);
app.use(entryRoutes);
app.use(whitelistRoutes);
app.use(statusRoutes);
app.use(adminRoutes);
app.use(userRoutes);
app.use(badgeRoutes);

app.listen(PORT, () => {
   log("info", `[SERVER]: Listening on port ${PORT}`);
});

export default app;
