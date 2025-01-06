import { TinaNodeBackend } from '@tinacms/datalayer';
import { TinaAuthJSOptions, AuthJsBackendAuthProvider } from 'tinacms-authjs';
import databaseClient from '../tina/__generated__/databaseClient'; // Make sure this path is correct

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === 'true';

const handler = TinaNodeBackend({
  authProvider: isLocal
    ? new LocalAuthProvider()  // Use LocalAuthProvider for local development
    : AuthJsBackendAuthProvider({
        authOptions: {
          clientId: process.env.CLIENT_ID,       // Google OAuth Client ID
          clientSecret: process.env.CLIENT_SECRET, // Google OAuth Client Secret
          databaseClient,                                // Database client for user info
          secret: process.env.AUTH_SECRET, 
        },
      }),
  databaseClient,
});

export default (req, res) => {
  return handler(req, res);
};
