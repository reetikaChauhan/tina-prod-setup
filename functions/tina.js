import express from 'express';
import cookieParser from 'cookie-parser';
import ServerlessHttp from 'serverless-http';
import { TinaNodeBackend, LocalBackendAuthProvider } from '@tinacms/datalayer';
import { AuthJsBackendAuthProvider, TinaAuthJSOptions } from 'tinacms-authjs';
import { OAuth2Client } from 'google-auth-library';
import cors from 'cors';
import dotenv from 'dotenv';
import { databaseClient } from '../../tina/__generated__/databaseClient';

dotenv.config();

const app = express();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use(cookieParser());

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === 'true';

const tinaBackend = TinaNodeBackend({
  authProvider: isLocal
    ? LocalBackendAuthProvider()
    : AuthJsBackendAuthProvider({
        authOptions: TinaAuthJSOptions({
          databaseClient,
          secret: process.env.AUTH_SECRET,
          debug: true,
        }),
      }),
  databaseClient,
});

// Middleware to verify Google OAuth token
const verifyGoogleToken = async (req, res, next) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload();
    req.user = payload; // Attach the user info to the request
    next();
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

app.post('/api/tina/*', verifyGoogleToken, async (req, res, next) => {
  tinaBackend(req, res, next);
});

app.get('/api/tina/*', verifyGoogleToken, async (req, res, next) => {
  tinaBackend(req, res, next);
});

export const handler = ServerlessHttp(app);
