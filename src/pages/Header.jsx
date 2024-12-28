import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const authToken = localStorage.getItem("authToken");
  const handleLogout = () => {
    // Clear auth token and redirect to login
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center px-10">
      <div className="text-xl font-bold">
        <Link to="/dashboard" className="hover:text-gray-200">
          teeBay
        </Link>
      </div>
      <nav className="space-x-4">
        <Link to="/dashboard" className="hover:text-gray-200">
          Dashboard
        </Link>
        <Link to="/createproduct" className="hover:text-gray-200">
          Create Product
        </Link>
        <Link to="/allproducts" className="hover:text-gray-200">
          All Products
        </Link>
        <Link to="/checkout" className="hover:text-gray-200">
          Checkout
        </Link>

        {authToken && (
          <button
            onClick={handleLogout}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-400"
          >
            Logout
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;
