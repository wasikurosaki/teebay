const productModel = require("../models/product");
const userModel = require("../models/user");

// Create Product Controller
const createProduct = async (req, res) => {
  const { title, description, price, categories } = req.body;
  const userId = req.user.id; // Assuming user is authenticated and user ID is in the request

  try {
    // Create the product in the database
    const product = await productModel.createProduct(
      title,
      description,
      price,
      categories,
      userId
    );
    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Edit Product Controller
const editProduct = async (req, res) => {
  const { title, description, price, categories } = req.body;
  const { productId } = req.params; // Get the product ID from the URL

  try {
    // Get the existing product
    const product = await productModel.getProductById(Number(productId));
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update the product
    const updatedProduct = await productModel.updateProduct(
      Number(productId),
      title,
      description,
      price,
      categories
    );

    res.status(200).json({
      message: "Product updated successfully",
      updatedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Buy Product Controller
const buyProduct = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id; // Assuming the user is authenticated

  try {
    // Get the product
    const product = await productModel.getProductById(Number(productId));
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.status === "SOLD") {
      return res.status(400).json({ message: "Product is already sold" });
    }

    // Mark the product as sold
    await productModel.markProductAsSold(Number(productId));

    // Create a transaction record
    const transaction = await prisma.transaction.create({
      data: {
        type: "buy",
        productId: Number(productId),
        buyerId: userId,
      },
    });

    res.status(200).json({
      message: "Product bought successfully",
      transaction,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Rent Product Controller
const rentProduct = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id; // Assuming the user is authenticated

  try {
    // Get the product
    const product = await productModel.getProductById(Number(productId));
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.status === "RENTED") {
      return res.status(400).json({ message: "Product is already rented" });
    }

    // Mark the product as rented
    await productModel.markProductAsRented(Number(productId));

    // Create a transaction record for renting
    const transaction = await prisma.transaction.create({
      data: {
        type: "rent",
        productId: Number(productId),
        renterId: userId,
      },
    });

    res.status(200).json({
      message: "Product rented successfully",
      transaction,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  createProduct,
  editProduct,
  buyProduct,
  rentProduct,
};
