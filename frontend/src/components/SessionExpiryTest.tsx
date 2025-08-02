/**
 * Session Expiry Test Component
 * This component helps test the session expiry handling
 */

import React from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../utils/api";

const SessionExpiryTest: React.FC = () => {
  const { user, logout } = useAuth();

  const simulateSessionExpiry = async () => {
    console.log("🧪 Simulating session expiry...");

    // Remove token to simulate expiry
    localStorage.removeItem("token");

    // Make an API call that should trigger 401
    try {
      await api.get("/api/auth/me");
    } catch (error) {
      console.log("Expected 401 error triggered");
    }
  };

  const simulateMultipleAPICalls = async () => {
    console.log("🧪 Simulating multiple API calls with expired token...");

    // Remove token
    localStorage.removeItem("token");

    // Make multiple simultaneous API calls
    const promises = [
      api.get("/api/auth/me"),
      api.get("/api/auth/me"),
      api.get("/api/auth/me"),
    ];

    try {
      await Promise.all(promises);
    } catch (error) {
      console.log("Expected multiple 401 errors triggered");
    }
  };

  if (!user) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Session Expiry Test</h3>
        <p className="text-gray-600">
          Please log in first to test session expiry handling.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Session Expiry Test</h3>
      <p className="text-sm text-gray-600 mb-4">
        Current user: <strong>{user.email}</strong>
      </p>

      <div className="space-y-2">
        <button
          onClick={simulateSessionExpiry}
          className="block w-full px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          🧪 Test Single Session Expiry
        </button>

        <button
          onClick={simulateMultipleAPICalls}
          className="block w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          🧪 Test Multiple API Calls Expiry
        </button>

        <button
          onClick={logout}
          className="block w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          🚪 Normal Logout
        </button>
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded text-sm">
        <h4 className="font-semibold text-blue-800">Expected Behavior:</h4>
        <ul className="mt-2 text-blue-700 list-disc list-inside">
          <li>
            Single toast message: "Your session has expired. Please sign in
            again."
          </li>
          <li>Immediate auth state clearing</li>
          <li>Redirect to /auth/signin after 1.5 seconds</li>
          <li>No multiple toasts or redirect loops</li>
        </ul>
      </div>
    </div>
  );
};

export default SessionExpiryTest;
