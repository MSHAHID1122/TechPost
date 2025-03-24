"use client"; // Mark this as a Client Component

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state for login
  const router = useRouter();

  // Check if the user is already logged in (e.g., by checking for a JWT token)
  useEffect(() => {
    const token = localStorage.getItem("token"); // Check for a stored JWT token
    if (token) {
      router.push("/"); // Redirect to the home page if the user is already logged in
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Set loading state to true

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Login failed");
      }

      const data = await response.json();
      const token = data.token; // Assuming the server returns a JWT token

      // Store the token in local storage (or cookies)
      localStorage.setItem("token", token);

      toast.success("Logged in successfully!");
      router.push("/"); // Redirect to the home page
    } catch (error: any) {
      console.error("Error during login:", error);
      toast.error(error.message || "An error occurred while logging in.");
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
          Login
        </h1>
        <form onSubmit={handleLogin} className="space-y-4">
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
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-md"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-purple-600 hover:underline dark:text-purple-400"
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
