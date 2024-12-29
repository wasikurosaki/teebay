import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_ALL_PRODUCTS,
  UPDATE_PRODUCT,
  DELETE_PRODUCT,
} from "../graphql/queries";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteProduct] = useMutation(DELETE_PRODUCT);
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: 0,
    rentPrice: 0,
    rentType: "per hr", // Default to 'per hr'
    categories: [],
  });
  const availableCategories = [
    { id: 1, label: "Electronics" },
    { id: 2, label: "Clothing" },
    { id: 3, label: "Books" },
    { id: 4, label: "Home & Garden" },
  ];

  const { data, loading, error } = useQuery(GET_ALL_PRODUCTS);

  const authToken = localStorage.getItem("authToken");
  useEffect(() => {
    if (!authToken) {
      navigate("/login");
    }
  }, [authToken, navigate]);

  const [updateProduct] = useMutation(UPDATE_PRODUCT);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setProductData({
      name: product.name,
      description: product.description,
      price: product.price,
      rentPrice: product.rentPrice,
      rentType: product.rentType || "per hr",
      categories: product.categories || [],
    });
    setModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]:
        name === "categories"
          ? value
              .split(",")
              .map((cat) => parseInt(cat.trim()))
              .filter((cat) => !isNaN(cat))
          : value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProduct({
        variables: {
          id: selectedProduct.id,
          name: productData.name,
          description: productData.description,
          price: parseFloat(productData.price),
          userId: productData.userId,
          categories: Array.isArray(productData.categories)
            ? productData.categories
            : typeof productData.categories === "string"
            ? productData.categories
                .split(",")
                .map((cat) => parseInt(cat.trim()))
                .filter((cat) => !isNaN(cat))
            : [],
          rentPrice: parseFloat(productData.rentPrice),
          rentType: productData.rentType,
        },
        update: (cache, { data: { updateProduct } }) => {
          const existingProducts = cache.readQuery({
            query: GET_ALL_PRODUCTS,
          });

          if (existingProducts) {
            const updatedProducts = existingProducts.products.map((product) =>
              product.id === selectedProduct.id
                ? {
                    ...product,
                    ...updateProduct,
                    userId: product.userId,
                    createdAt: product.createdAt,
                  }
                : product
            );

            cache.writeQuery({
              query: GET_ALL_PRODUCTS,
              data: {
                products: updatedProducts,
              },
            });
          }
        },
      });
      setModalOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct({
        variables: { id },
        update: (cache, { data }) => {
          const existingProducts = cache.readQuery({
            query: GET_ALL_PRODUCTS,
          });

          if (existingProducts) {
            const newProducts = existingProducts.products.filter(
              (product) => product.id !== id
            );

            cache.writeQuery({
              query: GET_ALL_PRODUCTS,
              data: {
                products: newProducts,
              },
            });
          }
        },
      });
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  console.log(data);
  return (
    <div className="flex flex-col w-full bg-gray-100 min-h-[100vh] p-8">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-center">My Products</h2>
        {data?.products?.length === 0 ? (
          <p>No products found</p>
        ) : (
          <ul className="mt-4 flex flex-col items-center">
            {data.products
              .filter(
                (product) =>
                  product.userId === parseInt(localStorage.getItem("userId"))
              )
              .map((product) => (
                <li
                  key={product.id}
                  className="p-4 rounded shadow-sm mb-2 border-[2px] h-auto w-3/4 py-10 flex flex-col gap-8"
                >
                  <h3 className="font-bold">{product?.name}</h3>
                  <p>
                    Categories:{" "}
                    {product.categories
                      ?.map((categoryId) => {
                        const category = availableCategories.find(
                          (cat) => cat.id === categoryId
                        );
                        return category ? category.label : null;
                      })
                      .filter((label) => label !== null)
                      .join(", ")}
                  </p>
                  <p>Price: ${product.price.toFixed(2)}</p>
                  <p>
                    Rent Price: ${product.rentPrice.toFixed(2)} (
                    {product.rentType})
                  </p>
                  <p>{product.description}</p>
                  {/* <p>User ID: {product.userId}</p> */}
                  <p>
                    Date Posted:{" "}
                    {`${new Date(product.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )}`}
                  </p>
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleProductClick(product)}
                      className="bg-blue-500 text-white px-4 py-2 rounded mt-4 self-start"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded mt-4 self-start"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        )}
      </div>

      {modalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg w-1/3">
            <h2 className="text-xl font-semibold">Edit Product</h2>
            <form onSubmit={handleFormSubmit} className="mt-4">
              <div className="mb-4">
                <label className="block text-sm">Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={productData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm">Description</label>
                <textarea
                  name="description"
                  value={productData.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm">Price</label>
                <input
                  type="number"
                  name="price"
                  value={productData.price}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm">Rent Price</label>
                <input
                  type="number"
                  name="rentPrice"
                  value={productData.rentPrice}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm">Rent Type</label>
                <select
                  name="rentType"
                  value={productData.rentType}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="per hr">Per Hour</option>
                  <option value="per day">Per Day</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm">Categories</label>
                <input
                  type="text"
                  name="categories"
                  value={productData.categories.join(", ")}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
