const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLList,
} = require("graphql");
const { ProductType, UserType } = require("./type"); // Import types
const prisma = require("../prismaClient"); // Import Prisma Client instance
const { login } = require("../controller/userController"); // Import login function from controller
const {
  createProduct,
  getProductById,
  updateProduct,
  buyProduct,
  rentProduct,
  deleteProduct,
} = require("../controller/productController");
const {
  createUser,
  findUserByEmail,
  updateUser,
} = require("../controller/userController");

// Root query to fetch data
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    products: {
      type: new GraphQLList(ProductType),
      resolve: async () => {
        return await prisma.product.findMany(); // Fetch all products
      },
    },
    product: {
      type: ProductType,
      args: { id: { type: GraphQLInt } },
      resolve: (parent, args) => getProductById(args.id), // Fetch a single product by ID
    },
    user: {
      type: UserType,
      args: { email: { type: GraphQLString } },
      resolve: (parent, args) => findUserByEmail(args.email), // Fetch user by email
    },
  },
});

// Mutations to modify data
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addProduct: {
      type: ProductType,
      args: {
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        price: { type: GraphQLFloat },
        categories: { type: new GraphQLList(GraphQLInt) }, // Array of category IDs
        userId: { type: GraphQLInt }, // User ID who owns the product
      },
      resolve: (parent, args) => createProduct(args), // Handle product creation
    },

    updateProduct: {
      type: ProductType,
      args: {
        id: { type: GraphQLInt },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        price: { type: GraphQLFloat },
        categories: { type: new GraphQLList(GraphQLInt) }, // Array of category IDs
      },
      resolve: (parent, args) => updateProduct(args), // Handle product update
    },
    markProductAsSold: {
      type: ProductType,
      args: {
        id: { type: GraphQLInt },
        userId: { type: GraphQLInt }, // Add userId to the arguments
      },
      resolve: (parent, args) =>
        buyProduct({ productId: args.id, userId: args.userId }), // Pass both id and userId to buyProduct
    },

    markProductAsRented: {
      type: ProductType,
      args: {
        id: { type: GraphQLInt },
        userId: { type: GraphQLInt }, // Add userId to the arguments
      },
      resolve: (parent, args) =>
        rentProduct({ productId: args.id, userId: args.userId }),
    },

    deleteProduct: {
      type: ProductType,
      args: {
        id: { type: GraphQLInt },
      },

      resolver: async (parent, args) => {
        const { id } = args;
        return await deleteProduct(id);
      },
    },

    //user segment

    addUser: {
      type: UserType,
      args: {
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
        address: { type: GraphQLString },
      },
      resolve: (parent, args) =>
        createUser(
          args.firstName,
          args.lastName,
          args.email,
          args.password,
          args.address
        ), // Create user
    },
    getUserByEmail: {
      type: UserType,
      args: {
        email: { type: GraphQLString }, // Email as input argument
      },
      resolve: async (parent, args) => {
        return await prisma.user.findUnique({
          where: { email: args.email },
        }); // Fetch user by email
      },
    },

    login: {
      type: GraphQLString, // The return type will be the JWT token (string)
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve: async (parent, { email, password }) => {
        try {
          // Call the login function from userController to authenticate and get token
          const token = await login({ email, password });
          return token; // Return the JWT token
        } catch (error) {
          throw new Error(error.message); // If any error occurs, throw it
        }
      },
    },

    updateUser: {
      type: UserType,
      args: {
        userId: { type: GraphQLInt },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        email: { type: GraphQLString },
        address: { type: GraphQLString },
      },
      resolve: (parent, args) =>
        updateUser(
          args.userId,
          args.firstName,
          args.lastName,
          args.email,
          args.address
        ), // Update user information
    },
  },
});

// Define the schema
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
