const express = require("express");
const { graphqlHTTP } = require("express-graphql"); // Import express-graphql middleware
const schema = require("./src/schema/schema"); // Assuming schema is exported from a schema.js file
const app = express();

// Use the express-graphql middleware for handling GraphQL queries
app.use(
  "/graphql",
  graphqlHTTP({
    schema, // Pass the schema created in your schema.js file
    graphiql: true, // Set to true to enable GraphiQL interface in browser (optional)
  })
);

// Start the server
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
