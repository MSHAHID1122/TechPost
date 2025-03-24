"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookOpen, ThumbsUp, MessageSquare } from "lucide-react";
import { useTheme } from "next-themes";
import MobileCategoryFilter from "@/components/ui/MobileCategoryFilter"; // Import the Mobile Filter

interface Post {
  id: number;
  title: string;
  excerpt: string;
  image_url: string;
  category: string;
  likes_count: number;
  comments_count: number;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string>("All"); // State for selected category

  // Fetch posts from the Flask API
  useEffect(() => {
    const fetchPosts = async () => {
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
        setError(
          "Unable to load posts. Please make sure the backend server is running."
        );
        console.error("Error fetching posts:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Filter posts based on the selected category
  const filteredPosts =
    selectedCategory === "All"
      ? posts
      : posts.filter((post) => post.category === selectedCategory);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-xl text-gray-600 dark:text-gray-300">
          Loading posts...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 gray dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-xl text-gray-600 dark:text-gray-400 mb-2">
            Error
          </h2>
          <p className="text-gray-600 dark:text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800">
      {/* Mobile Category Filter */}
      <MobileCategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl md:text-6xl"></h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300 sm:mt-4">
            Insights and articles about AI, Data Science, and Machine Learning
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <Link href={`/post/${post.id}`} key={post.id}>
              <Card className="h-full hover:shadow-lg transition-shadow duration-200 ">
                <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="text-sm text-primary mb-2">
                    {post.category}
                  </div>
                  <CardTitle className="line-clamp-2 dark:text-white">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground line-clamp-3 dark:text-gray-300">
                    {post.excerpt}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between text-muted-foreground dark:text-gray-300">
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
      </div>
    </main>
  );
}
