import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Configure Google login using NextAuth.js
//export const handler = NextAuth({
 // providers: [
 //   GoogleProvider({
 //     clientId: process.env.CLIENT_ID,       // Set your Google Client ID here
 //     clientSecret: process.env.CLIENT_SECRET, // Set your Google Client Secret here
 //   }),
 // ],
//   secret: process.env.AUTH_SECRET, // A random secret for session handling

//   // Optionally, handle session customization
//   callbacks: {
//     async session({ session, user }) {
//       session.user.id = user.id;
//       session.user.email = user.email;
//       session.user.name = user.name;
//       return session;
//     },
//   },
// });

//export default handler;
import { TinaNodeBackend, LocalBackendAuthProvider } from '@tinacms/datalayer'
import { TinaAuthJSOptions, AuthJsBackendAuthProvider } from 'tinacms-authjs'
import databaseClient from '../tina/__generated__/databaseClient'

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === 'true'

const handler = TinaNodeBackend({
  authProvider: isLocal
    ? LocalBackendAuthProvider()
    : AuthJsBackendAuthProvider({
        authOptions: {
          clientId: process.env.CLIENT_ID || '',
          clientSecret: process.env.CLIENT_SECRET || '',
          databaseClient,
          secret: process.env.AUTH_SECRET || '',
        },
      }),
  databaseClient,
})

export default (req, res) => {
  // Modify the request here if you need to
  return handler(req, res)
}
