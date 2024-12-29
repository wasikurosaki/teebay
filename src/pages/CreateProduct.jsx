import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { ADD_PRODUCT } from "../graphql/queries";
import { useNavigate } from "react-router-dom";

const STEPS = {
  TITLE: 0,
  CATEGORIES: 1,
  DESCRIPTION: 2,
  PRICE: 3,
  SUMMARY: 4,
};

const CreateProduct = () => {
  const authToken = localStorage.getItem("authToken");
  const navigate = useNavigate();
  useEffect(() => {
    if (!authToken) {
      navigate("/login");
    }
  }, [authToken, navigate]);

  const [currentStep, setCurrentStep] = useState(STEPS.TITLE);
  const [formData, setFormData] = useState({
    name: "",
    categories: [],
    description: "",
    price: "",
    rentPrice: "",
    rentType: "",
  });

  const availableCategories = [
    { id: 1, label: "Electronics" },
    { id: 2, label: "Clothing" },
    { id: 3, label: "Books" },
    { id: 4, label: "Home & Garden" },
  ];

  const [addProduct, { loading, error }] = useMutation(ADD_PRODUCT);

  const handleNext = () => {
    if (currentStep < STEPS.SUMMARY) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > STEPS.TITLE) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      categories: [],
      description: "",
      price: "",
      rentPrice: "",
      rentType: "",
    });
    setCurrentStep(STEPS.TITLE);
  };

  const handleSubmit = async () => {
    try {
      const userId = parseInt(localStorage.getItem("userId"));
      const response = await addProduct({
        variables: {
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          rentPrice: parseFloat(formData.rentPrice),
          rentType: formData.rentType,
          categories: formData.categories,
          userId: userId,
        },
      });

      if (response.data) {
        resetForm();
      }
    } catch (err) {
      console.error("Error creating product:", err);
    }
  };

  const renderSummary = () => {
    const selectedCategories = availableCategories
      .filter((cat) => formData.categories.includes(cat.id))
      .map((cat) => cat.label)
      .join(", ");

    return (
      <div className="space-y-6 w-full">
        <h2 className="text-xl font-semibold mb-4">Review Your Product</h2>

        <div className="space-y-4">
          <div className="border-b pb-2">
            <p className="text-sm font-medium text-gray-500">Title</p>
            <p className="mt-1">{formData.name}</p>
          </div>

          <div className="border-b pb-2">
            <p className="text-sm font-medium text-gray-500">Categories</p>
            <p className="mt-1">{selectedCategories}</p>
          </div>

          <div className="border-b pb-2">
            <p className="text-sm font-medium text-gray-500">Description</p>
            <p className="mt-1 whitespace-pre-wrap">{formData.description}</p>
          </div>

          <div className="border-b pb-2">
            <p className="text-sm font-medium text-gray-500">Price</p>
            <p className="mt-1">${parseFloat(formData.price).toFixed(2)}</p>
          </div>

          <div className="border-b pb-2">
            <p className="text-sm font-medium text-gray-500">Rent Price</p>
            <p className="mt-1">${parseFloat(formData.rentPrice).toFixed(2)}</p>
          </div>

          <div className="border-b pb-2">
            <p className="text-sm font-medium text-gray-500">Rent Type</p>
            <p className="mt-1">{formData.rentType}</p>
          </div>
        </div>
      </div>
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case STEPS.TITLE:
        return (
          <div className="space-y-4 w-full">
            <label className="block text-sm font-medium text-gray-700">
              Product Title
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter product title"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        );

      case STEPS.CATEGORIES:
        return (
          <div className="space-y-4 w-full">
            <label className="block text-sm font-medium text-gray-700">
              Select Categories
            </label>
            <div className="grid grid-cols-2 gap-4">
              {availableCategories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`category-${category.id}`}
                    checked={formData.categories.includes(category.id)}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        categories: e.target.checked
                          ? [...formData.categories, category.id]
                          : formData.categories.filter(
                              (id) => id !== category.id
                            ),
                      });
                    }}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300"
                  />
                  <label
                    htmlFor={`category-${category.id}`}
                    className="text-sm text-gray-700"
                  >
                    {category.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        );

      case STEPS.DESCRIPTION:
        return (
          <div className="space-y-4 w-full">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Enter product description"
              className="w-full px-4 py-2 border rounded-lg min-h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        );

      case STEPS.PRICE:
        return (
          <div className="space-y-4 w-full">
            <label className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              placeholder="Enter price"
              min="0"
              step="0.01"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <label className="block text-sm font-medium text-gray-700 mt-4">
              Rent Price
            </label>
            <input
              type="number"
              value={formData.rentPrice}
              onChange={(e) =>
                setFormData({ ...formData, rentPrice: e.target.value })
              }
              placeholder="Enter rent price"
              min="0"
              step="0.01"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <label className="block text-sm font-medium text-gray-700 mt-4">
              Rent Type
            </label>
            <select
              value={formData.rentType}
              onChange={(e) =>
                setFormData({ ...formData, rentType: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select rent type</option>
              <option value="per day">Per Day</option>
              <option value="per hour">Per Hour</option>
            </select>
          </div>
        );

      case STEPS.SUMMARY:
        return renderSummary();

      default:
        return null;
    }
  };

  const isNextDisabled = () => {
    switch (currentStep) {
      case STEPS.TITLE:
        return !formData.name.trim();
      case STEPS.CATEGORIES:
        return formData.categories.length === 0;
      case STEPS.DESCRIPTION:
        return !formData.description.trim();
      case STEPS.PRICE:
        return !formData.price || parseFloat(formData.price) <= 0;
      case STEPS.SUMMARY:
        return false;
      default:
        return false;
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500 text-center">Error: {error.message}</div>
    );
  }

  return (
    <div className="flex flex-col items-center p-6 max-w-2xl mx-auto">
      <div className="w-full bg-white rounded-lg shadow-md p-6">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold mb-2">Create New Product</h1>
          <p className="text-gray-500">
            Step {currentStep + 1} of {Object.keys(STEPS).length}
          </p>
        </div>

        {renderStep()}

        <div className="flex justify-between mt-6">
          {currentStep > STEPS.TITLE && (
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-gray-300 text-white rounded-lg"
            >
              Back
            </button>
          )}

          <button
            onClick={handleNext}
            disabled={isNextDisabled()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg"
          >
            {currentStep === STEPS.SUMMARY ? "Submit" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;
