import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

const Dashboard = () => {
  const navigate = useNavigate(); // Hook to navigate programmatically

  useEffect(() => {
    // Check if the user is logged in by checking the token in localStorage
    if (!localStorage.getItem("authToken")) {
      // If no token is found, redirect to the login page
      navigate("/login");
    }
  }, [navigate]); // Empty dependency array ensures this runs only once after component mounts

  const handleLogout = () => {
    // Remove the token from localStorage to log the user out
    localStorage.removeItem("authToken");

    // Redirect the user to the login page after logout
    navigate("/login");
  };

  return (
    <div className="bg-red-500 h-[100vh] flex justify-center items-center flex-col">
      <h1 className="text-white text-3xl">Dashboard</h1>
      <button
        onClick={handleLogout}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
