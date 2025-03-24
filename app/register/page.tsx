"use client"; // Mark this as a Client Component

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission behavior

    console.log("Register button clicked"); // Debugging
    console.log("Registration data:", { email, name, password }); // Debugging

    try {
      // Send a POST request to the Flask backend
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, password }),
      });

      console.log("Response status:", response.status); // Debugging

      const data = await response.json();
      console.log("Response data:", data); // Debugging

      if (response.ok) {
        toast.success("Registration successful! Please log in.");
        router.push("/login"); // Redirect to the login page
      } else {
        toast.error(data.error || "Registration failed.");
      }
    } catch (error) {
      console.error("Error during registration:", error); // Debugging
      toast.error("An error occurred while registering.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
          Register
        </h1>
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-200"
            required
          />
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
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-purple-600 hover:underline dark:text-purple-400"
          >
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
