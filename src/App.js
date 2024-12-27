import React from "react";
import { ApolloProvider } from "@apollo/client";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"; // Import Navigate for redirection
import client from "./apolloClient"; // Import Apollo Client
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard"; // Assuming you have a Dashboard component

const App = () => {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="App">
          <Routes>
            {/* If the user is logged in, navigate to Dashboard, otherwise Login */}
            <Route
              path="/"
              element={
                localStorage.getItem("authToken") ? (
                  <Navigate to="/dashboard" />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            {/* Login Route */}
            <Route path="/login" element={<Login />} />
            {/* Dashboard Route */}
            <Route path="/dashboard" element={<Dashboard />} />
            {/* Signup Route */}
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </div>
      </Router>
    </ApolloProvider>
  );
};

export default App;
