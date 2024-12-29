const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLList,
  GraphQLNonNull,
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
        const products = await prisma.product.findMany({
          include: {
            categories: true, // Include categories for each product
          },
        });

        return products.map((product) => ({
          ...product,
          categories: product.categories.map((cat) => cat.id),
          createdAt: product.createdAt.toISOString(),
        }));
      },
    },
    products_inactive: {
      type: new GraphQLList(ProductType),
      resolve: async () => {
        const products = await prisma.product.findMany({
          where: {
            status: {
              not: "Active", // Filter products where status is not 'active'
            },
          },
          include: {
            categories: true, // Include categories for each product
          },
        });

        return products.map((product) => ({
          ...product,
          categories: product.categories.map((cat) => cat.id),
          createdAt: product.createdAt.toISOString(),
        }));
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
        rentPrice: { type: GraphQLFloat },
        rentType: { type: GraphQLString },
        categories: { type: new GraphQLList(GraphQLInt) }, // Array of category IDs
        userId: { type: GraphQLInt }, // User ID who owns the product
      },

      resolve: (parent, args) => {
        console.log("Received data in resolver:", args); // Log received data
        return createProduct(args); // Handle product creation
      }, // Handle product creation
    },

    updateProduct: {
      type: ProductType,
      args: {
        id: { type: GraphQLInt },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        price: { type: GraphQLFloat },
        rentPrice: { type: GraphQLFloat },
        rentType: { type: GraphQLString },
        categories: { type: new GraphQLList(GraphQLInt) }, // Array of category IDs
      },
      resolve: (parent, args) => updateProduct(args), // Handle product update
    },
    markProductAsSold: {
      type: ProductType,
      args: {
        id: { type: GraphQLInt },
        userId: { type: GraphQLInt },
        buyerId: { type: GraphQLInt },
      },
      resolve: (parent, args) => {
        console.log(args); // Log args to check if buyerId is present
        return buyProduct({
          productId: args.id,
          userId: args.userId,
          buyerId: args.buyerId,
        });
      },
    },
    markProductAsRented: {
      type: ProductType,
      args: {
        id: { type: GraphQLInt },
        userId: { type: GraphQLInt },
        buyerId: { type: GraphQLInt },
        rentStart: { type: GraphQLString }, // Add rentStart as a string
        rentEnd: { type: GraphQLString }, // Add rentEnd as a string
      },
      resolve: (parent, args) =>
        rentProduct({
          productId: args.id,
          userId: args.userId,
          buyerId: args.buyerId,
          rentStart: args.rentStart,
          rentEnd: args.rentEnd,
        }),
    },

    deleteProduct: {
      type: new GraphQLNonNull(GraphQLString), // Make it non-null
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) }, // Make id non-null too
      },
      resolve: async (parent, args) => {
        // Note: it's 'resolve', not 'resolver'
        const { id } = args;
        const result = await deleteProduct(id);
        return result;
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
      type: new GraphQLObjectType({
        name: "LoginResponse",
        fields: {
          token: { type: GraphQLString },
          userId: { type: GraphQLInt }, // Adjust the type based on your `userId` type
        },
      }),
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve: async (parent, { email, password }) => {
        try {
          // Call the login function from userController to authenticate and get token and userId
          const { token, userId } = await login({ email, password });
          return { token, userId }; // Return both token and userId
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
