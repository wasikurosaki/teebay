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
    <div className="flex flex-col w-full bg-gray-100 h-auto p-8">
      <button
        onClick={() => {
          localStorage.removeItem("authToken");
          navigate("/login");
        }}
        className="fixed bg-red-500 text-white px-4 py-2 rounded mb-4 right-8 "
      >
        Logout
      </button>

      {/* Display All Products */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-center">My Products</h2>
        {data?.products?.length === 0 ? (
          <p>No products found</p>
        ) : (
          <ul className="mt-4">
            {data.products.map((product) => (
              <li
                key={product.id}
                className="p-4  rounded shadow-sm mb-2 border-[2px] mx-96 h-auto py-10 flex flex-col gap-8 "
              >
                <h3 className="font-bold">{product?.name}</h3>
                <p>Categories: {product.categories?.join(", ")}</p>
                <p>Price: ${product.price.toFixed(2)}</p>
                <p>{product.description}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
      <button className="fixed bg-blue-500 text-white px-4 py-2 rounded mb-4 right-8 top-[800px] ">
        Add Product
      </button>
    </div>
  );
};

export default Dashboard;
