const { TinaNodeBackend, LocalBackendAuthentication } = require('@tinacms/datalayer');
const { TinaAuthJSOptions, AuthJsBackendAuthentication } = require('tinacms-authjs');
const databaseClient = require('../tina/__generated__/databaseClient');

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === 'true';

const handler = TinaNodeBackend({
  authentication: isLocal
    ? LocalBackendAuthentication()
    : AuthJsBackendAuthentication({
        authOptions: TinaAuthJSOptions({
          databaseClient: databaseClient.default, // Ensure you're importing the database client correctly
          secret: process.env.AUTH_SECRET,
        }),
      }),
  databaseClient,
});

exports.handler = async (event, context) => {
  return handler(event, context);
};
