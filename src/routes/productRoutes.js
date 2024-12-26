const express = require("express");
const {
  createProduct,
  editProduct,
  buyProduct,
  rentProduct,
} = require("../controller/productController");
const authenticate = require("../utils/auth"); // Middleware to authenticate users

const router = express.Router();

// Create Product route
router.post("/create", authenticate, createProduct);

// Edit Product route
router.put("/edit/:productId", authenticate, editProduct);

// Buy Product route
router.put("/buy/:productId", authenticate, buyProduct);

// Rent Product route
router.put("/rent/:productId", authenticate, rentProduct);

module.exports = router;
