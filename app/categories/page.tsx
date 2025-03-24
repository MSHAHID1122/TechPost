"use client"; // Mark this component as a Client Component

import { useState, useEffect } from "react";
import Link from "next/link";
import { Code, Shield, Globe, Brain, Cpu, Database } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ThumbsUp, MessageSquare, BookOpen } from "lucide-react";

interface Category {
  id: number;
  name: string;
}

interface Post {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  image_url: string;
  likes_count: number;
  comments_count: number;
}

// Hardcoded categories
const categories: Category[] = [
  { id: 1, name: "Machine Learning" },
  { id: 2, name: "Data Science" },
  { id: 3, name: "Artificial Intelligence" },
];

const categoryIcons: { [key: string]: React.ElementType } = {
  "Machine Learning": Brain,
  "Data Science": Database,
  "Artificial Intelligence": Cpu,
};

export default function Categories() {
  const [selectedCategory, setSelectedCategory] =
    useState<string>("Machine Learning");
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch posts from the Flask API
  useEffect(() => {
    async function fetchPosts() {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch("http://localhost:5000/api/posts");
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError("Unable to load posts. Please try again later.");
        console.error("Error fetching posts:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPosts();
  }, []);

  // Filter posts based on the selected category
  const filteredPosts = posts.filter(
    (post) => post.category === selectedCategory
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading posts...</div>
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
    <section className="mb-12 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {categories.map((category, index) => {
          const Icon = categoryIcons[category.name] || Brain;
          return (
            <div
              key={category.id}
              onClick={() => setSelectedCategory(category.name)}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col items-center justify-center text-center hover:shadow-lg transition-shadow duration-300 cursor-pointer ${
                selectedCategory === category.name
                  ? "border-2 border-purple-600"
                  : ""
              }`}
            >
              <Icon className="w-12 h-12 mb-4 text-purple-600 dark:text-purple-400" />
              <h3 className="text-lg font-semibold">{category.name}</h3>
            </div>
          );
        })}
      </div>
      <h3 className="text-2xl font-bold mb-6">{selectedCategory} Posts</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map((post) => (
          <Link href={`/post/${post.id}`} key={post.id}>
            <Card className="h-full hover:shadow-lg transition-shadow duration-200">
              <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                <img
                  src={post.image_url}
                  alt={post.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <CardHeader>
                <div className="text-sm text-primary mb-2">{post.category}</div>
                <CardTitle className="line-clamp-2">{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground line-clamp-3">
                  {post.excerpt}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <ThumbsUp className="h-4 w-4" />
                  <span>{post.likes_count}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>{post.comments_count}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4" />
                  <span>Read more</span>
                </div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
