// netlify/functions/tina-graphql.js
const { createServer } = require('@tinacms/graphql');
const path = require('path');
const fs = require('fs');
const schemaPath = path.resolve(__dirname, '../tina/__generated__/schema.gql');
const schemaString = fs.readFileSync(schemaPath, 'utf8');

// Path to your schema file
//

// Create a GraphQL server using TinaCMS schema
const server = createServer({
  schema: require(schemaString),  // Use the generated GraphQL schema file
});

exports.handler = async (event, context) => {
  return server(event, context);  // Handle incoming GraphQL queries
};
