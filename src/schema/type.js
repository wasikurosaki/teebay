const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLList,
} = require("graphql");

// Define the CategoryType (assuming you have a category model)
const CategoryType = new GraphQLObjectType({
  name: "Category",
  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
  }),
});

// Define the UserType
const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLInt },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    address: { type: GraphQLString },
    products: { type: new GraphQLList(ProductType) }, // List of products associated with the user
  }),
});

// Define the ProductType
const ProductType = new GraphQLObjectType({
  name: "Product",
  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    price: { type: GraphQLFloat },
    categories: { type: new GraphQLList(GraphQLInt) }, // Categories should be an array
    status: { type: GraphQLString },
    userId: { type: GraphQLInt },
    createdAt: { type: GraphQLString },
    rentType: { type: GraphQLString },
    rentPrice: { type: GraphQLFloat },
    rentStart: { type: GraphQLString },
    rentEnd: { type: GraphQLString },
    buyerId: { type: GraphQLInt },
  }),
});

// Export both types
module.exports = { ProductType, UserType, CategoryType };
