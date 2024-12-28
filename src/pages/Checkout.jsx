import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_ALL_PRODUCTS } from "../graphql/queries";

const Checkout = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const userId = localStorage.getItem("userId");

  const { loading, error, data } = useQuery(GET_ALL_PRODUCTS, {
    fetchPolicy: "cache-and-network",
  });

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error)
    return (
      <div className="text-center p-4 text-red-500">Error: {error.message}</div>
    );

  const availableProducts =
    data?.products.filter(
      (product) => product.userId !== userId && product.status === "Active"
    ) || [];

  const handleBuyProduct = (productId) => {
    // Implement buy logic here
    console.log("Buying product:", productId);
  };

  const handleRentProduct = (productId) => {
    // Implement rent logic here
    console.log("Renting product:", productId);
  };

  if (selectedProduct) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <button
          onClick={() => setSelectedProduct(null)}
          className="mb-6 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          ← Back to Products
        </button>

        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold mb-4">{selectedProduct.name}</h2>
          <p className="text-gray-600 mb-4">{selectedProduct.description}</p>
          <div className="border-t border-b py-4 my-4">
            <p className="text-2xl font-semibold mb-2">
              Price: ${selectedProduct.price}
            </p>
            <p className="text-gray-600">
              Categories: {selectedProduct.categories.join(", ")}
            </p>
          </div>

          <div className="flex gap-4 mt-8">
            <button
              onClick={() => handleBuyProduct(selectedProduct.id)}
              className="flex-1 bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600"
            >
              Buy Product
            </button>
            <button
              onClick={() => handleRentProduct(selectedProduct.id)}
              className="flex-1 bg-green-500 text-white py-3 rounded-md hover:bg-green-600"
            >
              Rent Product
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6">Available Products</h1>
      {availableProducts.length === 0 ? (
        <div className="text-center text-gray-500">
          No active products available for purchase or rent.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <h3 className="text-xl font-bold mb-2">{product.name}</h3>
              <p className="text-gray-600 mb-2 line-clamp-2">
                {product.description}
              </p>
              <p className="text-lg font-semibold">Price: ${product.price}</p>
              <div className="mt-2">
                <span className="text-sm text-gray-500">
                  Categories: {product.categories.join(", ")}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Checkout;
