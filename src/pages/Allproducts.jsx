import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { GET_ALL_PRODUCTS } from "../graphql/queries";

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

const TabButton = ({ isActive, label, onClick }) => (
  <button
    className={`rounded-md px-4 py-2 ${
      isActive ? "bg-blue-500 text-white" : "bg-white text-black"
    } hover:scale-105 transition-transform`}
    onClick={onClick}
  >
    {label}
  </button>
);

const ProductCard = ({ product }) => (
  <div
    key={product.id}
    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
  >
    <h3 className="text-xl font-bold mb-2">{product.name}</h3>
    <p className="text-gray-600 mb-2">{product.description}</p>
    <p className="text-lg font-semibold">Price: ${product.price}</p>
    <div className="mt-2">
      <span className="text-sm text-gray-500">Status: {product.status}</span>
    </div>
    <div className="mt-2">
      <span className="text-sm text-gray-500">
        Categories: {product.categories.join(", ")}
      </span>
    </div>
  </div>
);

const AllProducts = () => {
  const [activeTab, setActiveTab] = useState("all");
  const authToken = localStorage.getItem("authToken");
  const userId = parseInt(localStorage.getItem("userId"));
  const navigate = useNavigate();

  const { loading, error, data } = useQuery(GET_ALL_PRODUCTS, {
    fetchPolicy: "cache-and-network", // Show cached data first, then update from network
  });

  useEffect(() => {
    if (!authToken) {
      navigate("/login");
    }
  }, [authToken, navigate]);

  const filterProducts = () => {
    console.log(data.products);
    if (!data?.products) return [];

    switch (activeTab) {
      case "sold":
        return data.products.filter(
          (product) => product.status === "sold" && product.userId === userId
        );
      case "bought":
        return data.products.filter(
          (product) => product.status === "sold" && product.buyerId === userId
        );
      case "lent":
        return data.products.filter(
          (product) => product.status === "rented" && product.userId === userId
        );
      case "rent":
        return data.products.filter(
          (product) => product.status === "rented" && product.buyerId === userId
        );
      default:
        return data.products;
    }
  };

  const filteredProducts = filterProducts();

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error)
    return (
      <div className="text-center p-4 text-red-500">Error: {error.message}</div>
    );

  return (
    <div className="min-h-screen">
      <header className="py-4 px-20">
        <div className="flex flex-row justify-around">
          {["sold", "bought", "rent", "lent"].map((tab) => (
            <TabButton
              key={tab}
              label={tab.charAt(0).toUpperCase() + tab.slice(1)}
              isActive={activeTab === tab}
              onClick={() => setActiveTab(tab)}
            />
          ))}
        </div>
      </header>

      <main className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
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