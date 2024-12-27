import { gql } from "@apollo/client";

// Query to fetch all products
export const GET_ALL_PRODUCTS = gql`
  query {
    products {
      id
      name
      description
      price
      categories
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
  ) {
    addProduct(
      name: $name
      description: $description
      price: $price
      categories: $categories
      userId: $userId
    ) {
      id
      name
      description
      price
      categories
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
  ) {
    updateProduct(
      id: $id
      name: $name
      description: $description
      price: $price
      categories: $categories
    ) {
      id
      name
      description
      price
      categories
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: Int!) {
    deleteProduct(id: $id) {
      id
      name
      description
      price
      categories
    }
  }
`;
