import React from "react";
import { ApolloProvider } from "@apollo/client";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import client from "./apolloClient";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import CreateProduct from "./pages/CreateProduct";
import Allproducts from "./pages/Allproducts";
import Checkout from "./pages/Checkout";
import Header from "./pages/Header"; // Import Header component

const App = () => {
  const isLoggedIn = localStorage.getItem("authToken");

  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="App">
          <Header />
          <Routes>
            <Route
              path="/"
              element={
                isLoggedIn ? (
                  <Navigate to="/dashboard" />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/createproduct" element={<CreateProduct />} />
            <Route path="/allproducts" element={<Allproducts />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </div>
      </Router>
    </ApolloProvider>
  );
};

export default App;
