import { google } from 'googleapis';
import dotenv from 'dotenv';
dotenv.config();

const OAuth2 = google.auth.OAuth2;

console.log('Client ID:', process.env.GOOGLE_CLIENT_ID);
console.log('Client Secret:', process.env.GOOGLE_CLIENT_SECRET);
console.log('Redirect URI:', process.env.GOOGLE_REDIRECT_URI);

const oauth2Client = new OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://mail.google.com/'],
});

console.log('Authorize this app by visiting this url:', url);

// After visiting the URL and authenticating, you will receive a code in the redirect URI.
// Use this code to get a refresh token.
const getToken = async (code) => {
    const { tokens } = await oauth2Client.getToken(code);
    console.log('Your refresh token:', tokens.refresh_token);
};

// Call getToken with the authorization code you receive after authenticating
// Example usage:
// getToken('your-authorization-code-here');
