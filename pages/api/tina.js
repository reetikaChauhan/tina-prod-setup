import { TinaNodeBackend } from "@tinacms/datalayer";
import { AuthJsBackendAuthProvider } from "tinacms-authjs";
import databaseClient from "../../../tina/__generated__/databaseClient";

// Import the session handler from next-auth
import { getSession } from "next-auth/react";

// Determine if the app is running locally
const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === "true";

const handler = TinaNodeBackend({
  authProvider: AuthJsBackendAuthProvider({
    authOptions: {
      async getUser(request) {
        // Use next-auth to validate the session
        const session = await getSession({ req: request });
        if (!session || !session.user) {
          throw new Error("Unauthorized");
        }
        return { email: session.user.email, name: session.user.name };
      },
      databaseClient,
      secret: process.env.AUTH_SECRET,
    },
  }),
  databaseClient,
});

export default (req, res) => {
  return handler(req, res);
};
