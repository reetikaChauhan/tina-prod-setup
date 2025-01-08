import express from 'express'
import type { RequestHandler } from 'express'
import cookieParser from 'cookie-parser'
import ServerlessHttp from 'serverless-http'
import { TinaNodeBackend, LocalBackendAuthProvider } from '@tinacms/datalayer'
import { AuthJsBackendAuthProvider, TinaAuthJSOptions } from 'tinacms-authjs'
import cors from 'cors'
import dotenv from 'dotenv'

import { databaseClient } from '../../tina/__generated__/databaseClient'

dotenv.config()

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(express.json())
app.use(cookieParser())

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === 'true'

// Tina AuthJSOptions with Google OAuth
const tinaAuthOptions = TinaAuthJSOptions({
  databaseClient,
  secret: process.env.AUTH_SECRET, // Ensure this is set in environment variables
  providers: [
    {
      id: 'google',
      name: 'Google',
      type: 'oauth',
      clientId: process.env.CLIENT_ID, // From Google Cloud Console
      clientSecret: process.env.CLIENT_SECRET, // From Google Cloud Console
      wellKnown: 'https://accounts.google.com/.well-known/openid-configuration',
      authorization: { params: { scope: 'openid email profile' } },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    },
  ],
  debug: true,
});
const tinaBackend = TinaNodeBackend({
  authProvider: isLocal
    ? LocalBackendAuthProvider()
    : AuthJsBackendAuthProvider({
        authOptions: tinaAuthOptions
      }),
  databaseClient,
})

app.post('/api/tina/*', async (req, res, next) => {
  // Modify request if needed
  tinaBackend(req, res, next)
})

app.get('/api/tina/*', async (req, res, next) => {
  // Modify request if needed
  tinaBackend(req, res, next)
})

export const handler = ServerlessHttp(app)