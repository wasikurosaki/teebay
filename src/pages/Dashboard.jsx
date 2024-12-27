import React, { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_ALL_PRODUCTS } from "../graphql/queries"; // Adjust the import based on your file structure
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  // Fetch all products using the useQuery hook
  const { data, loading, error } = useQuery(GET_ALL_PRODUCTS);

  // Check if the user is authenticated
  const authToken = localStorage.getItem("authToken");
  useEffect(() => {
    if (!authToken) {
      navigate("/login"); // Redirect to login if user is not authenticated
    }
  }, [authToken, navigate]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  console.log(data);
  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <button
        onClick={() => {
          localStorage.removeItem("authToken");
          navigate("/login");
        }}
        className="bg-red-500 text-white px-4 py-2 rounded mb-4"
      >
        Logout
      </button>

      {/* Display All Products */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold">All Products</h2>
        {data?.products?.length === 0 ? (
          <p>No products found</p>
        ) : (
          <ul className="mt-4">
            {data.products.map((product) => (
              <li
                key={product.id}
                className="p-4 border rounded shadow-sm mb-2 bg-white"
              >
                <h3 className="font-bold">{product?.name}</h3>
                <p>{product.description}</p>
                <p>${product.price.toFixed(2)}</p>
                <p>Categories: {product.categories?.join(", ")}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
