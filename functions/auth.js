import { Auth } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const handler = Auth({
  providers: [
    GoogleProvider({
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    }),
  ],
  secret: process.env.AUTH_SECRET, // A random secret string
  callbacks: {
    async signIn({ user, account, profile }) {
      // Handle sign-in logic (optional)
      return true;
    },
  },
});
