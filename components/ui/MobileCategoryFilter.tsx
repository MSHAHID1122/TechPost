"use client";

import { Brain, Database, Cpu, Globe } from "lucide-react";

interface Category {
  id: number;
  name: string;
}

const categories: Category[] = [
  { id: 0, name: "All" }, // Add "All" option
  { id: 1, name: "Machine Learning" },
  { id: 2, name: "Data Science" },
  { id: 3, name: "Artificial Intelligence" },
];

const categoryIcons: { [key: string]: React.ElementType } = {
  All: Globe, // Use an icon for "All" (or leave it out if you prefer)
  "Machine Learning": Brain,
  "Data Science": Database,
  "Artificial Intelligence": Cpu,
};

export default function MobileCategoryFilter({
  selectedCategory,
  onSelectCategory,
}: {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}) {
  return (
    <div className="md:hidden bg-white dark:bg-gray-800 shadow-sm py-4">
      <div className="container mx-auto px-4">
        <div className="flex gap-2">
          {categories.map((category) => {
            const Icon = categoryIcons[category.name] || Brain;
            return (
              <button
                key={category.id}
                onClick={() => onSelectCategory(category.name)}
                className={`flex-1 flex items-center justify-center space-x-2 px-2 py-2 rounded-full transition-colors ${
                  selectedCategory === category.name
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                style={{
                  flex: `1 0 calc(${100 / categories.length}% - ${
                    (categories.length - 1) * 0.5
                  }rem)`, // Adjust for gap
                }}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs sm:text-sm">{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
