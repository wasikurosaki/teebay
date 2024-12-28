import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { gql } from "graphql-tag";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook

const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      userId
    }
  }
`;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginUser, { data, loading, error }] = useMutation(LOGIN_USER);
  const navigate = useNavigate(); // Initialize the navigate function

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await loginUser({
        variables: { email, password },
      });

      if (data && data.login) {
        const { token, userId } = data.login;

        // Store the token and userId in localStorage
        localStorage.setItem("authToken", token);
        localStorage.setItem("userId", userId);

        console.log("Login successful. Token:", token, "UserId:", userId);

        // Redirect to the dashboard
        navigate("/dashboard");
      } else {
        console.error("Login failed: No token or userId received.");
      }
    } catch (err) {
      console.error("Error during login:", err);
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (error)
    return <p className="text-center text-red-500">Error: {error.message}</p>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>
        </form>
        <button
          onClick={() => navigate("/signup")}
          className="mt-4 w-full text-center text-blue-500 hover:underline"
        >
          Don't have an account? Signup
        </button>
      </div>
    </div>
  );
};

export default Login;
