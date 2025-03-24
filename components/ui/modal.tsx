"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: any, token: string) => void; // Updated to accept both user and token
  postId: string; // Add postId as a prop
}

export default function Modal({
  isOpen,
  onClose,
  onLoginSuccess,
  postId, // Destructure postId
}: ModalProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and registration
  const [error, setError] = useState<string | null>(null); // To store error messages
  const router = useRouter();

  const handleRegister = async () => {
    // Reset error message
    setError(null);

    // Validate fields
    if (!email || !name || !password) {
      setError("All fields are required.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Registration successful! Please log in.");
        setIsLogin(true); // Switch to login form after successful registration
      } else {
        setError(data.error || "Registration failed.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setError("An error occurred while registering.");
    }
  };

  const handleLogin = async () => {
    // Reset error message
    setError(null);

    // Validate fields
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Logged in successfully!");
        onLoginSuccess(data.user, data.token); // Pass both user and token to the callback
        onClose(); // Close the modal

        // Reload the current post's page
        router.push(`/post/${postId}`); // Use the correct route
      } else {
        setError(data.error || "Invalid email or password.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("An error occurred while logging in.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
        >
          &times;
        </button>
        <div className="space-y-4">
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
            {isLogin ? "Login" : "Register"}
          </h2>

          {/* Display error message */}
          {error && (
            <div className="text-red-500 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Registration Form Fields (only shown if isLogin is false) */}
          {!isLogin && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-200"
              required
            />
          )}

          {/* Common Form Fields */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-200"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-200"
            required
          />

          {/* Submit Button */}
          <button
            onClick={isLogin ? handleLogin : handleRegister}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-md"
          >
            {isLogin ? "Login" : "Register"}
          </button>

          {/* Toggle between Login and Registration */}
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null); // Clear error when toggling
              }}
              className="text-purple-600 hover:underline dark:text-purple-400"
            >
              {isLogin ? "Register" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
