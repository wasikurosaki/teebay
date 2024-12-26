const prisma = require("../prismaClient"); // Import Prisma Client instance

// Function to create a new user
const createUser = async (firstName, lastName, email, password, address) => {
  try {
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password,
        address, // Save the address
      },
    });
    return user; // Return the created user
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Unable to create user");
  }
};

// Function to find a user by email
const findUserByEmail = async (email) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email }, // Find user by email
    });
    return user;
  } catch (error) {
    console.error("Error finding user by email:", error);
    throw new Error("Unable to find user");
  }
};

// Function to update user details
const updateUser = async (userId, firstName, lastName, email, address) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        email,
        address, // Update the address
      },
    });
    return updatedUser;
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Unable to update user");
  }
};

module.exports = {
  createUser,
  findUserByEmail,
  updateUser,
};
