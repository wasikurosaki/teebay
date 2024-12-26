const prisma = require("../prismaClient");

// Create a product
const createProduct = async (title, description, price, categories, userId) => {
  return await prisma.product.create({
    data: {
      title,
      description,
      price,
      categories: {
        connect: categories.map((categoryId) => ({ id: categoryId })),
      },
      userId,
    },
  });
};

// Get a product by ID
const getProductById = async (id) => {
  return await prisma.product.findUnique({
    where: { id },
    include: { categories: true, user: true, transaction: true },
  });
};

// Get all products for a user
const getUserProducts = async (userId) => {
  return await prisma.product.findMany({
    where: { userId },
    include: { categories: true },
  });
};

// Update product details
const updateProduct = async (id, title, description, price, categories) => {
  return await prisma.product.update({
    where: { id },
    data: {
      title,
      description,
      price,
      categories: {
        set: categories.map((categoryId) => ({ id: categoryId })),
      },
    },
  });
};

// Mark product as sold
const markProductAsSold = async (id) => {
  return await prisma.product.update({
    where: { id },
    data: {
      status: "SOLD",
    },
  });
};

// Mark product as rented
const markProductAsRented = async (id) => {
  return await prisma.product.update({
    where: { id },
    data: {
      status: "RENTED",
    },
  });
};

module.exports = {
  createProduct,
  getProductById,
  getUserProducts,
  updateProduct,
  markProductAsSold,
  markProductAsRented,
};
