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

const findUserByEmail = async (email) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user;
  } catch (error) {
    console.error("Error finding user by email:", error);
    throw new Error("Unable to find user");
  }
};
const getAllUsers = async () => {
  try {
    const users = await prisma.user.findMany();
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Unable to fetch users");
  }
};

// Login controller for GraphQL
const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (password !== user.password) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return { token, userId: user.id }; // Returning both token and userId
};

module.exports = {
  createUser,
  login,
  updateUser,
  findUserByEmail,
  getAllUsers,
};
