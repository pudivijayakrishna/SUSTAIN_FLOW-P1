// backend/utils/mailer.js

import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const accessToken = async () => {
    try {
        const { token } = await oauth2Client.getAccessToken();
        return token;
    } catch (error) {
        console.error('Error retrieving access token', error);
        throw new Error('Error retrieving access token');
    }
};

const createTransporter = async () => {
    const accessTokenValue = await accessToken();
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: process.env.GMAIL_USER, // Gmail address
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
            accessToken: accessTokenValue,
        },
    });
};

const sendMail = async (to, subject, text) => {
    try {
        const transporter = await createTransporter();
        const result = await transporter.sendMail({
            from: process.env.GMAIL_USER, // Gmail address
            to,
            subject,
            text,
        });

        console.log('Email sent:', result);
    } catch (error) {
        console.error('Error while sending email:', error);
    }
};

export default sendMail;
