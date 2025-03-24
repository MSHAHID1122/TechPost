"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Category {
  name: string;
  // Add other properties if needed
}

export async function generateStaticParams() {
  // Fetch categories from your backend or define them manually
  const categories = await fetch("http://localhost:5000/api/categories")
    .then((res) => res.json())
    .catch((err) => {
      console.error("Failed to fetch categories:", err);
      return [];
    });

  // Return an array of all possible category paths
  return categories.map((category: Category) => ({
    category: category.name, // Adjust based on your API response
  }));
}

interface Post {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  image_url: string;
  created_at: string;
  comments: {
    id: number;
    post_id: number;
    content: string;
    created_at: string;
  }[];
}

export default function CategoryPosts() {
  const params = useParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(
          `http://localhost:5000/api/categories/${params.category}/posts`
        );
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
  }, [params.category]);

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Posts in {params.category}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <Link key={post.id} href={`/post/${post.id}`}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
              <h2 className="text-xl font-bold mb-2">{post.title}</h2>
              <p className="text-muted-foreground line-clamp-3">
                {post.excerpt}
              </p>
              <div className="mt-4 flex justify-between text-muted-foreground">
                <span>{post.comments.length} Comments</span>
                <span>{new Date(post.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
