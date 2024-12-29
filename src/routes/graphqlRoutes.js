const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const schema = require("../schema/schema"); // Path to your GraphQL schema
const router = express.Router();

router.use(
  "/graphql", // GraphQL endpoint
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

module.exports = router;
