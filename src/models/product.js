const prisma = require("../prismaClient"); // Import Prisma Client instance

// Create a new product (for GraphQL mutation)
const createProduct = async (args) => {
  const { name, description, price, categories, userId } = args;

  try {
    // First, verify that all categories exist
    const existingCategories = await prisma.category.findMany({
      where: {
        id: {
          in: categories,
        },
      },
    });

    if (existingCategories.length !== categories.length) {
      throw new Error("One or more categories not found");
    }

    const product = await prisma.product.create({
      data: {
        name, // Changed from 'title' to 'name' to match schema
        description,
        price,
        categories: {
          connect: categories.map((categoryId) => ({ id: categoryId })),
        },
        userId,
      },
      include: {
        categories: true, // Include categories in the response
        user: true, // Include user in the response
      },
    });

    return product;
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error(`Unable to create product: ${error.message}`);
  }
};

// Get a product by ID (for GraphQL query)
const getProductById = async (id) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { categories: true, user: true, transaction: true }, // Include related entities
    });
    return product;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    throw new Error("Unable to fetch product");
  }
};

// Get all products for a user (for GraphQL query)
const getUserProducts = async (userId) => {
  try {
    const products = await prisma.product.findMany({
      where: { userId },
      include: { categories: true },
    });
    return products;
  } catch (error) {
    console.error("Error fetching user's products:", error);
    throw new Error("Unable to fetch products");
  }
};

// Update product details (for GraphQL mutation)
const updateProduct = async (args) => {
  const { id, name, description, price, categories } = args;
  try {
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price,
        categories: {
          set: categories.map((categoryId) => ({ id: categoryId })),
        },
      },
    });
    return updatedProduct;
  } catch (error) {
    console.error("Error updating product:", error);
    throw new Error("Unable to update product");
  }
};

// Mark product as sold (for GraphQL mutation)
const markProductAsSold = async (id) => {
  try {
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        status: "sold",
      },
    });
    return updatedProduct;
  } catch (error) {
    console.error("Error marking product as sold:", error);
    throw new Error("Unable to mark product as sold");
  }
};

// Mark product as rented (for GraphQL mutation)
const markProductAsRented = async (id) => {
  try {
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        status: "rented",
      },
    });
    return updatedProduct;
  } catch (error) {
    console.error("Error marking product as rented:", error);
    throw new Error("Unable to mark product as rented");
  }
};

module.exports = {
  createProduct,
  getProductById,
  getUserProducts,
  updateProduct,
  markProductAsSold,
  markProductAsRented,
};
