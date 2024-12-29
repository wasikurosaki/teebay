import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_ALL_PRODUCTS,
  MARK_PRODUCT_AS_SOLD,
  MARK_PRODUCT_AS_RENTED,
} from "../graphql/queries";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const navigate = useNavigate();
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    if (!authToken) {
      navigate("/login");
    }
  }, [authToken, navigate]);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showRentModal, setShowRentModal] = useState(false);
  const [rentStart, setRentStart] = useState("");
  const [rentEnd, setRentEnd] = useState("");
  const userId = localStorage.getItem("userId");
  const availableCategories = [
    { id: 1, label: "Electronics" },
    { id: 2, label: "Clothing" },
    { id: 3, label: "Books" },
    { id: 4, label: "Home & Garden" },
  ];

  const { loading, error, data } = useQuery(GET_ALL_PRODUCTS, {
    fetchPolicy: "cache-and-network",
  });

  const [markProductAsSold] = useMutation(MARK_PRODUCT_AS_SOLD, {
    refetchQueries: [{ query: GET_ALL_PRODUCTS }],
  });

  const [markProductAsRented] = useMutation(MARK_PRODUCT_AS_RENTED, {
    refetchQueries: [{ query: GET_ALL_PRODUCTS }],
  });

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error)
    return (
      <div className="text-center p-4 text-red-500">Error: {error.message}</div>
    );

  const availableProducts =
    data?.products.filter(
      (product) =>
        product.userId !== parseInt(userId) && product.status !== "sold"
    ) || [];

  const handleBuyProduct = () => {
    setShowBuyModal(true);
  };

  const handleConfirmBuy = async () => {
    try {
      await markProductAsSold({
        variables: {
          id: parseInt(selectedProduct.id),
          userId: parseInt(selectedProduct.userId),
          buyerId: parseInt(userId),
        },
      });
      setShowBuyModal(false);
      setSelectedProduct(null);
    } catch (err) {
      console.error("Error marking product as sold:", err);
    }
  };

  const handleRentProduct = () => {
    setShowRentModal(true);
  };

  const handleConfirmRent = async () => {
    try {
      await markProductAsRented({
        variables: {
          id: parseInt(selectedProduct.id),
          userId: parseInt(selectedProduct.userId),
          rentStart,
          rentEnd,
          buyerId: parseInt(userId),
        },
      });
      setShowRentModal(false);
      setRentStart("");
      setRentEnd("");
      setSelectedProduct(null);
    } catch (err) {
      alert("Sorry! Already Booked For the Give Date!");
      console.error("Error marking product as rented:", err);
    }
  };

  // Buy Confirmation Modal
  const BuyModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <h3 className="text-xl font-bold mb-4">Confirm Purchase</h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to buy {selectedProduct.name} for $
          {selectedProduct.price}?
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => setShowBuyModal(false)}
            className="flex-1 bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600"
          >
            No, Cancel
          </button>
          <button
            onClick={handleConfirmBuy}
            className="flex-1 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            Yes, Buy Now
          </button>
        </div>
      </div>
    </div>
  );

  // Rent Modal
  const RentModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <h3 className="text-xl font-bold mb-4">Rent Product</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rent Start Date
            </label>
            <input
              type="date"
              value={rentStart}
              onChange={(e) => setRentStart(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rent End Date
            </label>
            <input
              type="date"
              value={rentEnd}
              onChange={(e) => setRentEnd(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
        </div>
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => {
              setShowRentModal(false);
              setRentStart("");
              setRentEnd("");
            }}
            className="flex-1 bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmRent}
            className="flex-1 bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
            disabled={!rentStart || !rentEnd}
          >
            Confirm Rent
          </button>
        </div>
      </div>
    </div>
  );

  if (selectedProduct) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        {showBuyModal && <BuyModal />}
        {showRentModal && <RentModal />}
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
          </div>

          <div className="flex gap-4 mt-8">
            <button
              onClick={handleBuyProduct}
              className="flex-1 bg-purple-900 text-white py-3 rounded-md hover:bg-blue-600"
            >
              Buy Product
            </button>
            <button
              onClick={handleRentProduct}
              className="flex-1 bg-purple-900 text-white py-3 rounded-md hover:bg-green-600"
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
                <p>
                  Categories:{" "}
                  {product.categories
                    ?.map((categoryId) => {
                      const category = availableCategories.find(
                        (cat) => cat.id === categoryId
                      );
                      return category ? category.label : null; // Return label if found, otherwise null
                    })
                    .filter((label) => label !== null) // Remove nulls in case of invalid IDs
                    .join(", ")}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Checkout;
