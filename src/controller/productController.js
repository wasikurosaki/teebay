const prisma = require("../prismaClient");
const { Product } = require("../models/product"); // Assuming Sequelize ORM

// Controller for creating a product

const createProduct = async ({
  name,
  description,
  price,
  categories,
  userId,
  rentPrice,
  rentType,
}) => {
  try {
    // Check if categories exist
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

    console.log("Product Data:", {
      name,
      description,
      price,
      userId,
      categories,
      rentPrice,
      rentType,
    });

    const product = await prisma.product.create({
      data: {
        name, // Map 'name' from the GraphQL mutation
        description,
        price,
        userId,
        rentPrice,
        rentType,
        categories: {
          connect: categories.map((categoryId) => ({ id: categoryId })),
        },
      },
      include: {
        categories: true, // Include categories in the response
      },
    });

    console.log("Created Product:", product);

    return {
      id: product.id,
      name: product.name, // Ensure you return 'name'
      description: product.description,
      price: product.price,
      rentPrice,
      rentType,
      categories: product.categories.map((cat) => cat.id), // Map categories to IDs
    };
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error(`Unable to create product: ${error.message}`);
  }
};

const updateProduct = async ({
  id,
  name,
  description,
  price,
  categories,
  rentPrice,
  rentType,
}) => {
  try {
    // Start building the update data
    const updateData = {};

    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (price) updateData.price = price;
    if (rentPrice) updateData.rentPrice = rentPrice;
    if (rentType) updateData.rentType = rentType;

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
      rentPrice: updatedProduct.rentPrice,
      rentType: updatedProduct.rentType,
      categories: updatedProduct.categories.map((cat) => cat.id), // Return category IDs
    };
  } catch (error) {
    console.error("Error updating product:", error);
    throw new Error("Unable to update product");
  }
};

// Controller for buying a product
const buyProduct = async ({ productId, userId, buyerId }) => {
  console.log("Received productId:", productId); // Check if productId is passed correctly
  console.log("Received userId:", userId);
  console.log("Received buyer:", buyerId); // Check if userId is passed correctly

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
    data: {
      status: "sold",
      user: {
        connect: { id: userId }, // Connect the user to the product using userId
      },
      buyerId: buyerId, // Assuming buyerId is a regular field, not a relationship
    },
  });

  // Return the updated product with the relevant fields
  return updatedProduct;
};

// Controller for renting a product
const rentProduct = async ({
  productId,
  userId,
  buyerId,
  rentStart,
  rentEnd,
}) => {
  console.log("Received productId:", productId); // Check if productId is passed correctly
  console.log("Received userId:", userId); // Check if userId is passed correctly
  console.log("Received rentStart:", rentStart); // Check if rentStart is passed correctly
  console.log("Received rentEnd:", rentEnd); // Check if rentEnd is passed correctly
  console.log("Received buyerId:", buyerId); // Check if buyerId is passed correctly

  if (!productId) {
    throw new Error("Product ID is required");
  }

  if (!rentStart || !rentEnd) {
    throw new Error("Start and end dates are required");
  }

  // Fetch the product from the database
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  // Check if the new rentStart date is later than the existing rentEnd date
  if (
    product.rentStart &&
    product.rentEnd &&
    ((rentStart >= new Date(product.rentStart) &&
      rentStart <= new Date(product.rentEnd)) || // Overlaps with the start of the current rental period
      (rentEnd >= new Date(product.rentStart) &&
        rentEnd <= new Date(product.rentEnd)) || // Overlaps with the end of the current rental period
      (rentStart <= new Date(product.rentStart) &&
        rentEnd >= new Date(product.rentEnd))) // Completely overlaps the current rental period
  ) {
    throw new Error(
      `The product is already rented from ${product.rentStart} to ${product.rentEnd}. Please choose a different time period.`
    );
  }

  // Update product status and rental dates
  const updatedProduct = await prisma.product.update({
    where: { id: productId },
    data: {
      status: "rented",
      user: {
        connect: { id: userId }, // Connect the user to the product using userId
      },
      buyerId: buyerId,
      rentStart: new Date(rentStart), // Convert to Date object
      rentEnd: new Date(rentEnd), // Convert to Date object
    },
  });

  console.log("Product marked as rented");
  return updatedProduct;
};

const deleteProduct = async (id) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    await prisma.product.delete({
      where: { id },
    });

    return "Product deleted successfully";
  } catch (error) {
    // Throw the actual error instead of wrapping it
    throw error;
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany(); // Fetch all products from the database
    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching products.",
      error: error.message,
    });
  }
};

// Export the functions
module.exports = {
  getAllProducts,
  createProduct,
  buyProduct,
  rentProduct,
  updateProduct,
  deleteProduct,
};
