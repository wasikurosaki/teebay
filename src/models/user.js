const prisma = require("../prismaClient"); // Import Prisma Client instance

// Function to create a new user (for GraphQL mutation)
const createUser = async (args) => {
  const { firstName, lastName, email, password, address } = args;
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

// Function to find a user by email (for GraphQL query)
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

// Function to update user details (for GraphQL mutation)
const updateUser = async (args) => {
  const { userId, firstName, lastName, email, address } = args;
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

// Function to authenticate user for login (for GraphQL query)
const authenticateUser = async (args) => {
  const { email, password } = args;
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.password !== password) {
      throw new Error("Invalid credentials");
    }

    return user; // Return authenticated user
  } catch (error) {
    console.error("Error authenticating user:", error);
    throw new Error("Authentication failed");
  }
};

module.exports = {
  createUser,
  findUserByEmail,
  updateUser,
  authenticateUser,
};
