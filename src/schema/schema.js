const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLList,
} = require("graphql");
const { ProductType } = require("./type"); // Import ProductType
const { UserType } = require("./type"); // Import UserType
const {
  createProduct,
  getProductById,
  getUserProducts,
  updateProduct,
  markProductAsSold,
  markProductAsRented,
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
        return await prisma.product.findMany();
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
        title: { type: GraphQLString },
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
        title: { type: GraphQLString },
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
      },
      resolve: (parent, args) => markProductAsSold(args.id), // Mark product as sold
    },
    markProductAsRented: {
      type: ProductType,
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent, args) => markProductAsRented(args.id), // Mark product as rented
    },
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
        ),
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
        ),
    },
  },
});

// Define the schema
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
