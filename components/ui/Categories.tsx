"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Code, Shield, Globe, Brain, Cpu, Database } from "lucide-react";

interface Category {
  id: number;
  name: string;
}

const categoryIcons: { [key: string]: React.ElementType } = {
  "Artificial Intelligence": Brain,
  Programming: Code,
  Cybersecurity: Shield,
  "Web Development": Globe,
  Hardware: Cpu,
  "Data Science": Database,
};

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch("http://localhost:5000/api/categories");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError("Unable to load categories. Please try again later.");
        console.error("Error fetching categories:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCategories();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading categories...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold mb-6">Categories</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((category, index) => {
          const Icon = categoryIcons[category.name] || Brain;
          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/categories/${encodeURIComponent(category.name)}`}>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col items-center justify-center text-center hover:shadow-lg transition-shadow duration-300">
                  <Icon className="w-12 h-12 mb-4 text-purple-600 dark:text-purple-400" />
                  <h3 className="text-lg font-semibold">{category.name}</h3>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
      <div className="mt-8 text-center">
        <Link href="/categories">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition-colors"
          >
            Explore All Categories
          </motion.button>
        </Link>
      </div>
    </section>
  );
}
