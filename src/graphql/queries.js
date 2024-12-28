import { gql } from "@apollo/client";

// Query to fetch all products
export const GET_ALL_PRODUCTS = gql`
  query {
    products {
      id
      name
      description
      price
      rentPrice
      categories
      userId
      status
      createdAt
      rentType
      buyerId
      rentStart
      rentEnd
    }
  }
`;

export const ADD_PRODUCT = gql`
  mutation AddProduct(
    $name: String!
    $description: String!
    $price: Float!
    $categories: [Int!]!
    $userId: Int!
    $rentPrice: Float!
    $rentType: String!
  ) {
    addProduct(
      name: $name
      description: $description
      price: $price
      categories: $categories
      userId: $userId
      rentPrice: $rentPrice
      rentType: $rentType
    ) {
      id
      name
      description
      price
      categories
      rentPrice
      rentType
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct(
    $id: Int!
    $name: String
    $description: String
    $price: Float
    $categories: [Int!]
    $rentPrice: Float
    $rentType: String
  ) {
    updateProduct(
      id: $id
      name: $name
      description: $description
      price: $price
      categories: $categories
      rentPrice: $rentPrice
      rentType: $rentType
    ) {
      id
      name
      description
      price
      categories
      rentPrice
      rentType
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation deleteProduct($id: Int!) {
    deleteProduct(id: $id)
  }
`;
export const MARK_PRODUCT_AS_SOLD = gql`
  mutation MarkProductAsSold($id: Int!, $userId: Int!, $buyerId: Int!) {
    markProductAsSold(id: $id, userId: $userId, buyerId: $buyerId) {
      id
      name
      status
      userId
      buyerId
    }
  }
`;

export const MARK_PRODUCT_AS_RENTED = gql`
  mutation MarkProductAsRented(
    $id: Int!
    $userId: Int!
    $rentStart: String!
    $rentEnd: String!
    $buyerId: Int!
  ) {
    markProductAsRented(
      id: $id
      userId: $userId
      rentStart: $rentStart
      rentEnd: $rentEnd
      buyerId: $buyerId
    ) {
      id
      name
      status
      userId
      rentStart
      rentEnd
      buyerId
    }
  }
`;
