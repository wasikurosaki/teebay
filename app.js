// Import necessary dependencies
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const userRoutes = require("./src/routes/userRoutes");
const productRoutes = require("./src/routes/productRoutes");
const authenticate = require("./src/utils/auth");

// Load environment variables
dotenv.config();

// Initialize the app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Parse incoming JSON requests

// Connect to database (optional, if you need to connect to DB explicitly)
// You can configure this connection based on your setup, like Prisma or Sequelize

// Routes
app.use("/api/user", userRoutes); // User-related routes (signup, login)
app.use("/api/product", authenticate, productRoutes); // Product-related routes (CRUD) with authentication

// Root route for health check
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Error handling middleware (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong" });
});

// Set the server port
const PORT = 3000 || 4000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
