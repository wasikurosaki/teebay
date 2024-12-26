const prisma = require("../prismaClient");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user"); // Assuming you're using Sequelize ORM, adjust accordingly.

// Signup controller for GraphQL

const createUser = async (firstName, lastName, email, password, address) => {
  try {
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password, // You may want to hash the password before storing it
        address,
      },
    });
    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Unable to create user");
  }
};

module.exports = {
  createUser,
};

const updateUser = async (userId, firstName, lastName, email, address) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        email,
        address,
      },
    });
    return updatedUser;
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Unable to update user");
  }
};

// Login controller for GraphQL
const login = async (args) => {
  const { email, password } = args;

  // Find the user by email
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error("User not found");
  }

  // Compare the password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid password");
  }

  // Generate JWT token
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return token; // Returning the JWT token
};

module.exports = { createUser, login, updateUser };
