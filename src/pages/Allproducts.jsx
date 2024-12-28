// First, let's set up the Apollo cache configuration (in your Apollo client setup file)
import { ApolloClient, InMemoryCache } from "@apollo/client";
import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_ALL_PRODUCTS } from "../graphql/queries";
import { useNavigate } from "react-router-dom";

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        products: {
          merge(existing = [], incoming) {
            return incoming; // Replace the entire array with new data
          },
        },
      },
    },
    Product: {
      keyFields: ["id"], // Use id as the primary key for Product type
    },
  },
});

export const client = new ApolloClient({
  uri: "http://localhost:3000/graphql",
  cache,
});

// Now, let's modify the AllProducts component to handle cache updates

const AllProducts = () => {
  const [activeTab, setActiveTab] = useState("all");
  const authToken = localStorage.getItem("authToken");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  // Modify the query to include fetchPolicy
  const { loading, error, data } = useQuery(GET_ALL_PRODUCTS, {
    fetchPolicy: "cache-and-network", // This will show cached data and update from network
    nextFetchPolicy: "cache-first", // Subsequent requests will use cache first
  });

  useEffect(() => {
    if (!authToken) {
      navigate("/login");
    }
  }, [authToken, navigate]);

  // Function to read filtered products directly from cache when possible
  const getFilteredProducts = () => {
    if (!data?.products) return [];

    let filteredData = [];
    switch (activeTab) {
      //   case "all":
      //     filteredData = data.products;
      //     break;
      case "sold":
        filteredData = data.products.filter(
          (product) => product.status === "sold"
        );
        break;
      case "bought":
        filteredData = data.products.filter(
          (product) => product.status === "sold" && product.userId === userId
        );
        break;
      case "rent":
        filteredData = data.products.filter(
          (product) => product.status === "rent" && product.userId === userId
        );
        break;
      case "lent":
        filteredData = data.products.filter(
          (product) => product.status === "rent" && product.userId !== userId
        );
        break;
      default:
        filteredData = [];
    }

    // Update cache with filtered results
    client.writeQuery({
      query: GET_ALL_PRODUCTS,
      data: {
        products: filteredData,
      },
      variables: { filter: activeTab },
    });

    return filteredData;
  };

  const filteredProducts = getFilteredProducts();

  // Handle cache updates when tab changes
  useEffect(() => {
    if (data?.products) {
      const filtered = getFilteredProducts();
      client.writeQuery({
        query: GET_ALL_PRODUCTS,
        data: {
          products: filtered,
        },
        variables: { filter: activeTab },
      });
    }
  }, [activeTab, data?.products]);

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error)
    return (
      <div className="text-center p-4 text-red-500">Error: {error.message}</div>
    );

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="py-4 bg-gray-800 px-20">
        <div className="flex flex-row justify-around">
          {/* <button
            className={`rounded-md px-4 py-2 ${
              activeTab === "all"
                ? "bg-blue-500 text-white"
                : "bg-white text-black"
            } hover:scale-105 transition-transform`}
            onClick={() => setActiveTab("all")}
          >
            All Products
          </button> */}

          <button
            className={`rounded-md px-4 py-2 ${
              activeTab === "sold"
                ? "bg-blue-500 text-white"
                : "bg-white text-black"
            } hover:scale-105 transition-transform`}
            onClick={() => setActiveTab("sold")}
          >
            Sold
          </button>

          <button
            className={`rounded-md px-4 py-2 ${
              activeTab === "bought"
                ? "bg-blue-500 text-white"
                : "bg-white text-black"
            } hover:scale-105 transition-transform`}
            onClick={() => setActiveTab("bought")}
          >
            Bought
          </button>

          <button
            className={`rounded-md px-4 py-2 ${
              activeTab === "rent"
                ? "bg-blue-500 text-white"
                : "bg-white text-black"
            } hover:scale-105 transition-transform`}
            onClick={() => setActiveTab("rent")}
          >
            Rent
          </button>

          <button
            className={`rounded-md px-4 py-2 ${
              activeTab === "lent"
                ? "bg-blue-500 text-white"
                : "bg-white text-black"
            } hover:scale-105 transition-transform`}
            onClick={() => setActiveTab("lent")}
          >
            Lent
          </button>
        </div>
      </header>

      <main className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-bold mb-2">{product.name}</h3>
              <p className="text-gray-600 mb-2">{product.description}</p>
              <p className="text-lg font-semibold">Price: ${product.price}</p>
              <div className="mt-2">
                <span className="text-sm text-gray-500">
                  Status: {product.status}
                </span>
              </div>
              <div className="mt-2">
                <span className="text-sm text-gray-500">
                  Categories: {product.categories.join(", ")}
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            No products found for this category.
          </div>
        )}
      </main>
    </div>
  );
};

export default AllProducts;
