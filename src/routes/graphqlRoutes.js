const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const schema = require("../schema/schema"); // Path to your GraphQL schema
const router = express.Router();

// Route to handle GraphQL requests
router.use(
  "/graphql", // GraphQL endpoint
  graphqlHTTP({
    schema: schema, // Use the schema defined in the GraphQL schema file
    graphiql: true, // Enable GraphiQL interface for testing in the browser
  })
);

module.exports = router;
