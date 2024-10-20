import express from "express";
import cors from 'cors';
import dotenv from "dotenv";
import connectDB from "./config/mongoose.js"; // Import the DB connection
import cookieParser from "cookie-parser";
import router from './routes/index.js';
import oauthRouter from './routes/oauth.js'; // Import the OAuth routes

dotenv.config();
const PORT = process.env.PORT || 8000;

const app = express();

// Connect to MongoDB
connectDB();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use('/', router);
app.use('/', oauthRouter); // Register the OAuth routes

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
