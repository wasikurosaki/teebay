const prisma = require("../prismaClient");
const { Product } = require("../models/product"); // Assuming Sequelize ORM

// Controller for creating a product

const createProduct = async ({
  name,
  description,
  price,
  categories,
  userId,
}) => {
  try {
    const product = await prisma.product.create({
      data: {
        name, // Map the title to the 'name' field in the Prisma model
        description,
        price,
        userId,
        categories: {
          connect: categories.map((id) => ({ id })), // Map categories to {id: value} format
        },
      },
      include: {
        categories: true, // Ensure categories are returned in the response
      },
    });
    console.log(product);
    return {
      id: product.id,
      name: product.name, // Map 'name' back to 'title' for GraphQL response
      description: product.description,
      price: product.price,
      categories: product.categories.map((cat) => cat.id), // Return category IDs
    };
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error("Unable to create product");
  }
};

const updateProduct = async ({ id, name, description, price, categories }) => {
  try {
    // Start building the update data
    const updateData = {};

    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (price) updateData.price = price;

    // If categories are provided, update the categories relationship
    if (categories) {
      updateData.categories = {
        set: categories.map((id) => ({ id })), // Set the new categories (this will replace the old ones)
      };
    }

    // Perform the update using Prisma
    const updatedProduct = await prisma.product.update({
      where: { id }, // Find product by ID
      data: updateData, // Pass the update data
      include: { categories: true }, // Include the updated categories in the response
    });

    console.log(updatedProduct); // Log the updated product (for debugging)

    // Return the updated product data
    return {
      id: updatedProduct.id,
      name: updatedProduct.name,
      description: updatedProduct.description,
      price: updatedProduct.price,
      categories: updatedProduct.categories.map((cat) => cat.id), // Return category IDs
    };
  } catch (error) {
    console.error("Error updating product:", error);
    throw new Error("Unable to update product");
  }
};

// Controller for buying a product
const buyProduct = async ({ productId, userId }) => {
  console.log("Received productId:", productId); // Check if productId is passed correctly
  console.log("Received userId:", userId); // Check if userId is passed correctly

  if (!productId) {
    throw new Error("Product ID is required");
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  product.status = "sold";
  console.log("Product makred sold");
  const updatedProduct = await prisma.product.update({
    where: { id: productId },
    data: { status: "sold", userId },
  });

  // Return the updated product with the relevant fields
  return updatedProduct;
};

// Controller for renting a product
const rentProduct = async ({ productId, userId }) => {
  console.log("Received productId:", productId); // Check if productId is passed correctly
  console.log("Received userId:", userId); // Check if userId is passed correctly

  if (!productId) {
    throw new Error("Product ID is required");
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  product.status = "rented";
  console.log("Product makred as rented");
  const updatedProduct = await prisma.product.update({
    where: { id: productId },
    data: { status: "rented", userId },
  });

  // Return the updated product with the relevant fields
  return updatedProduct;
};
const deleteProduct = async (id) => {
  try {
    // Check if the product exists
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    // Delete the product
    const deletedProduct = await prisma.product.delete({
      where: { id },
    });
    console.log("Product Deleted Successfully!");
    return deletedProduct;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw new Error("Unable to delete product");
  }
};
// Export the functions
module.exports = {
  createProduct,
  buyProduct,
  rentProduct,
  updateProduct,
  deleteProduct,
};
