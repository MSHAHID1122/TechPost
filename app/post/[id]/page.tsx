import PostClient from "./PostClient"; // Import the client component

// Fetch dynamic parameters for static site generation
export async function generateStaticParams() {
  try {
    const response = await fetch("http://localhost:5000/api/posts");
    if (!response.ok) {
      throw new Error("Failed to fetch posts");
    }
    const posts = await response.json();
    return posts.map((post: { id: number }) => ({ id: post.id.toString() }));
  } catch (error) {
    console.error("Error fetching static params:", error);
    return [];
  }
}

// Server-side function to fetch post data
export default async function PostPage({ params }: { params: { id: string } }) {
  try {
    const response = await fetch(
      `http://localhost:5000/api/posts/${params.id}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch post with id ${params.id}`);
    }
    const post = await response.json();

    // Pass fetched post data as a prop to the client component
    return <PostClient initialPost={post} />;
  } catch (error) {
    console.error("Error fetching post data:", error);
    return <div>Error loading the post. Please try again later.</div>;
  }
}
