const { Product } = require("../models/product"); // Assuming Sequelize ORM

// Controller for creating a product
const createProduct = async (args) => {
  const { title, description, price, category } = args;

  // Create a new product in the database
  const product = await Product.create({
    title,
    description,
    price,
    category: JSON.stringify(category), // Store categories as a JSON array
  });

  return product;
};

// Controller for buying a product
const buyProduct = async (args) => {
  const { productId, userId } = args;

  // Find the product by ID
  const product = await Product.findByPk(productId);
  if (!product) {
    throw new Error("Product not found");
  }

  // Update the product's status to 'sold'
  product.status = "sold";
  await product.save();

  // Optionally, associate the product with the user who bought it (if needed)
  // Example: product.userId = userId;

  return product;
};

// Controller for renting a product
const rentProduct = async (args) => {
  const { productId, userId } = args;

  // Find the product by ID
  const product = await Product.findByPk(productId);
  if (!product) {
    throw new Error("Product not found");
  }

  // Update the product's status to 'rented'
  product.status = "rented";
  await product.save();

  // Optionally, associate the product with the user who rented it (if needed)
  // Example: product.userId = userId;

  return product;
};

// Export the functions
module.exports = { createProduct, buyProduct, rentProduct };
