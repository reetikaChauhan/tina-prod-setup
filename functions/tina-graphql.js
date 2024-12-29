// netlify/functions/tina-graphql.js
const { createServer } = require('@tinacms/graphql');
const path = require('path');

// Path to your schema file
const schemaPath = path.resolve(__dirname, '../tina/__generated__/schema.gql');

// Create a GraphQL server using TinaCMS schema
const server = createServer({
  schema: require(schemaPath),  // Use the generated GraphQL schema file
});

exports.handler = async (event, context) => {
  return server(event, context);  // Handle incoming GraphQL queries
};
