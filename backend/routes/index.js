import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import donorRouter from './donor.js';
import agencyRouter from './agency.js';
import ngoRouter from './ngo.js';
import oauthRouter from './oauth.js'; // Import the new OAuth route
import * as controller from '../controller/index.js';
import { authenticateToken } from '../config/authMiddleware.js';

dotenv.config();
const router = express.Router();

const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    allowedHeaders: ['Authorization', 'Content-Type', 'Role'],
};

router.use(cors(corsOptions));

router.get('/', (req, res) => {
  return res.json('Hello!');
});

// Existing routes
router.use('/donor', donorRouter);
router.use('/agency', agencyRouter);
router.use('/ngo', ngoRouter);
router.post('/signup', controller.signup);
router.post('/create-session', controller.create_session);
router.get('/profile', authenticateToken, controller.profile);
router.post('/update-profile', authenticateToken, controller.update_profile);
router.get('/getTomTomApiKey', authenticateToken, (req, res) => {
    return res.status(200).json({ message: 'Api key sent successfully!', apiKey: process.env.TOMTOM_API_KEY });
});

// Use the new OAuth routes
router.use(oauthRouter);

export default router;
