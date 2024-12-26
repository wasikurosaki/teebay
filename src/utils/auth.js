require("dotenv").config();

const jwt = require("jsonwebtoken");

// Authentication middleware to verify JWT token
const authenticate = (req, res, next) => {
  // Extract the token from the Authorization header
  const token = req.header("Authorization")?.replace("Bearer ", "");

  // Check if the token exists
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    // Verify the token using JWT_SECRET from environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user info to the request object (user ID or any other info)
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Invalid or expired token." });
  }
};

module.exports = authenticate;
