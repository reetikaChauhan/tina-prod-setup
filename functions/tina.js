const { TinaNodeBackend, LocalBackendAuthentication } = require('@tinacms/datalayer');
const { TinaAuthJSOptions, AuthJsBackendAuthentication } = require('tinacms-authjs');
const { createServer } = require('@tinacms/graphql'); // Import the createServer function
const databaseClient = require('../tina/__generated__/databaseClient'); // Ensure this import is correct

// Check if the app is running in local mode or production mode
const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === 'true';

// Initialize the Tina Node backend with authentication setup
const handler = TinaNodeBackend({
  authentication: isLocal
    ? LocalBackendAuthentication()  // Local authentication (for local development)
    : AuthJsBackendAuthentication({
        authOptions: TinaAuthJSOptions({
          databaseClient: databaseClient.default,  // Ensure correct database client import
          secret: process.env.AUTH_SECRET,         // Secret for JWT authentication
        }),
      }),
  databaseClient,
});

// Create the Tina GraphQL server with the generated schema
const server = createServer({
  schema: require('../tina/schema').schema,  // Ensure schema file is correctly referenced
  config: {
    token: process.env.TINA_TOKEN,           // Optional: if you use a token for authentication
  },
});

// Netlify function handler to handle incoming requests
exports.handler = async (event, context) => {
  // Call the Tina GraphQL server to process the request
  return server(event, context); // Using the GraphQL server handler
};
