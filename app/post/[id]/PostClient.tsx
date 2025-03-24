"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  ThumbsUp,
  MessageSquare,
  UserCircle,
  Clock,
  Facebook,
  Twitter,
  MessageCircle,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";
import Modal from "@/components/ui/modal"; // Import the Modal component

export default function PostClient({ initialPost }: { initialPost: any }) {
  const [post, setPost] = useState({
    ...initialPost,
    comments: initialPost.comments || [], // Default to an empty array if comments is undefined
  });

  const [comment, setComment] = useState("");
  const [isLiking, setIsLiking] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null); // Track the logged-in user
  const [showLoginModal, setShowLoginModal] = useState(false); // Control the login modal
  const [showAllComments, setShowAllComments] = useState(false); // Track whether to show all comments
  const [isLiked, setIsLiked] = useState(false); // Track whether the post is liked by the current user

  // Fetch comments for the current post
  const fetchComments = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/posts/${post.id}/comments`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }
      const comments = await response.json();
      setPost((prevPost: typeof post) => ({
        ...prevPost,
        comments: comments || [], // Ensure comments is an array
      }));
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to fetch comments.");
    }
  };

  // Fetch comments when the component mounts or when post.id changes
  useEffect(() => {
    if (post.id) {
      fetchComments();
    }
  }, [post.id]);

  // Check if the user is logged in on page load and after login
  const fetchCurrentUser = async () => {
    const token = localStorage.getItem("token"); // Retrieve the JWT token
    if (!token) return; // No token, user is not logged in

    try {
      const response = await fetch("http://localhost:5000/api/me", {
        headers: {
          Authorization: token, // Include the token in the Authorization header
        },
      });

      if (!response.ok) throw new Error("Failed to fetch user");

      const data = await response.json();
      if (data.user) {
        setCurrentUser(data.user); // Set the currentUser state
        checkIfLiked(data.user.id); // Check if the user has already liked the post
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      toast.error("Failed to fetch user data.");
    }
  };

  // Check if the current user has already liked the post
  const checkIfLiked = async (userId: number) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/posts/${post.id}/check-like`,
        {
          headers: {
            Authorization: localStorage.getItem("token") || "", // Include the token in the Authorization header
          },
        }
      );

      if (!response.ok) throw new Error("Failed to check like status");

      const data = await response.json();
      setIsLiked(data.liked); // Set isLiked based on the response
    } catch (error) {
      console.error("Error checking like status:", error);
    }
  };

  // Fetch current user on component mount
  useEffect(() => {
    fetchCurrentUser();
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove the token from localStorage
    setCurrentUser(null); // Clear the currentUser state
    toast.success("Logged out successfully!");
  };

  // Handle like
  const handleLike = async () => {
    if (!currentUser) {
      setShowLoginModal(true); // Show the login modal
      return;
    }

    setIsLiking(true);
    try {
      const token = localStorage.getItem("token"); // Retrieve the JWT token
      const response = await fetch(
        `http://localhost:5000/api/posts/${post.id}/like`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: token }), // Include the token in the Authorization header if it exists
          },
        }
      );

      if (response.ok) {
        setIsLiked(!isLiked); // Toggle the like state
        setPost((prevPost: typeof post) => ({
          ...prevPost,
          likes_count: isLiked
            ? prevPost.likes_count - 1
            : prevPost.likes_count + 1, // Update likes count
        }));
        toast.success(isLiked ? "Post unliked!" : "Post liked!");
      } else {
        toast.error("Failed to like the post.");
      }
    } catch (error) {
      console.error("Error liking post:", error);
      toast.error("An error occurred while liking the post.");
    } finally {
      setIsLiking(false);
    }
  };

  // Handle comment
  const handleComment = async () => {
    if (!currentUser) {
      setShowLoginModal(true); // Show the login modal
      return;
    }

    if (!comment.trim()) {
      toast.error("Please enter a comment.");
      return;
    }

    setIsCommenting(true);
    try {
      const token = localStorage.getItem("token"); // Retrieve the JWT token
      const response = await fetch(
        `http://localhost:5000/api/posts/${post.id}/comment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: token }), // Include the token in the Authorization header if it exists
          },
          body: JSON.stringify({ content: comment }),
        }
      );

      if (response.ok) {
        const newComment = await response.json(); // Get the new comment data
        setPost((prevPost: typeof post) => ({
          ...prevPost,
          comments: [newComment, ...(prevPost.comments || [])], // Ensure comments is an array
        }));
        setComment(""); // Clear the comment input
        toast.success("Comment posted!");
      } else {
        toast.error("Failed to post the comment.");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("An error occurred while posting the comment.");
    } finally {
      setIsCommenting(false);
    }
  };

  // Callback function to update currentUser after successful login
  const handleLoginSuccess = (user: any, token: string) => {
    localStorage.setItem("token", token); // Save the token to localStorage
    setCurrentUser(user); // Update the currentUser state
    setShowLoginModal(false); // Close the modal
    fetchCurrentUser(); // Fetch the current user again to ensure state is updated
  };

  // Function to show all comments
  const showAllCommentsHandler = () => {
    setShowAllComments(true); // Set showAllComments to true to display all comments
  };

  // Handle sharing to social media
  const handleShare = (platform: string) => {
    const postUrl = window.location.href; // Get the current post URL
    const postTitle = post.title; // Get the post title

    switch (platform) {
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            postUrl
          )}`,
          "_blank"
        );
        break;
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(
            postUrl
          )}&text=${encodeURIComponent(postTitle)}`,
          "_blank"
        );
        break;
      case "whatsapp":
        window.open(
          `https://api.whatsapp.com/send?text=${encodeURIComponent(
            postTitle + " " + postUrl
          )}`,
          "_blank"
        );
        break;
      default:
        break;
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 overflow-x-hidden font-sans">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Post Card */}
        <Card className="mb-8 overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
          {post.image_url && (
            <div className="aspect-video w-full overflow-hidden">
              <img
                src={post.image_url}
                alt={post.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <CardHeader className="bg-gray-100 p-6">
            <div className="flex items-center gap-4 flex-wrap mb-4">
              <UserCircle className="h-10 w-10 text-gray-500 dark:text-gray-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="font-semibold truncate text-gray-800 dark:text-gray-200">
                  {post.author?.name || "Unknown Author"}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                  <Clock className="h-4 w-4 mr-1 flex-shrink-0" />
                  {new Date(post.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold break-words hyphens-auto text-gray-800 dark:text-gray-200">
              {post.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="bg-gray-200 dark:bg-gray-800 p-6">
            <div className="prose dark:prose-invert prose-sm sm:prose-base max-w-none font-sans text-gray-700 dark:text-gray-300">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                className="break-words"
                components={{
                  p: ({ node, ...props }) => (
                    <p
                      {...props}
                      className="break-words max-w-prose text-balance leading-relaxed font-sans"
                      style={{
                        maxWidth: "90ch",
                        wordBreak: "break-word",
                        hyphens: "auto",
                      }}
                    />
                  ),
                  pre: ({ node, ...props }) => (
                    <pre
                      {...props}
                      className="whitespace-pre-wrap break-words overflow-x-auto max-w-full font-sans"
                      style={{ maxWidth: "90ch" }}
                    />
                  ),
                  code: ({ node, ...props }) => (
                    <code
                      {...props}
                      className="break-words whitespace-pre-wrap max-w-full font-sans"
                      style={{ maxWidth: "90ch" }}
                    />
                  ),
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-200 p-6 flex flex-col gap-4 items-start">
            {/* Like Button */}
            <Button
              onClick={handleLike}
              disabled={isLiking}
              className={`flex items-center gap-2 ${
                isLiked
                  ? "bg-blue-500 hover:bg-blue-600 text-white" // Liked state
                  : "bg-transparent border border-gray-300 hover:bg-gray-100 text-gray-800 dark:text-gray-200" // Not liked state
              }`}
            >
              <ThumbsUp className="h-4 w-4" />
              <span>{isLiked ? "Liked" : "Like"}</span>
            </Button>

            {/* Share Buttons */}
            <div className="flex items-center gap-2">
              {/* Facebook Share Button */}
              <Button
                onClick={() => handleShare("facebook")}
                className="bg-transparent border border-gray-300 hover:bg-gray-100 text-gray-800 dark:text-gray-200"
              >
                <Facebook className="h-4 w-4" />
              </Button>

              {/* Twitter Share Button */}
              <Button
                onClick={() => handleShare("twitter")}
                className="bg-transparent border border-gray-300 hover:bg-gray-100 text-gray-800 dark:text-gray-200"
              >
                <Twitter className="h-4 w-4" />
              </Button>

              {/* WhatsApp Share Button */}
              <Button
                onClick={() => handleShare("whatsapp")}
                className="bg-transparent border border-gray-300 hover:bg-gray-100 text-gray-800 dark:text-gray-200"
              >
                <MessageCircle className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>

        {/* Comments Section */}
        <div className="space-y-6">
          <div className="space-y-4">
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
              className="min-h-[100px] w-full max-w-full font-sans text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-4"
              disabled={!currentUser}
            />
            <Button
              onClick={handleComment}
              disabled={isCommenting}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              {isCommenting ? "Posting..." : "Post Comment"}
            </Button>
            {/* Total number of comments */}
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total Comments: {post.comments.length}
            </p>
          </div>

          {/* Vertical Comments */}
          <div className="space-y-4">
            {(showAllComments ? post.comments : post.comments.slice(0, 2)).map(
              (c: any) => (
                <Card
                  key={c.id}
                  className="shadow-sm overflow-hidden bg-white dark:bg-gray-800"
                >
                  <CardContent className="pt-6 pb-4 px-6">
                    <div className="flex items-center gap-4 flex-wrap mb-4">
                      <UserCircle className="h-8 w-8 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="font-semibold truncate text-gray-800 dark:text-gray-200">
                          {c.author?.name || "Anonymous"}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                          <Clock className="h-4 w-4 mr-1 flex-shrink-0" />
                          {new Date(c.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p
                      className="text-gray-700 dark:text-gray-300 break-words max-w-prose"
                      style={{
                        maxWidth: "65ch",
                        wordBreak: "break-word",
                        hyphens: "auto",
                      }}
                    >
                      {c.content}
                    </p>
                  </CardContent>
                </Card>
              )
            )}
          </div>

          {/* Show More Button */}
          {!showAllComments && post.comments.length > 2 && (
            <Button
              onClick={showAllCommentsHandler}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Show All Comments
            </Button>
          )}
        </div>

        {/* Login Modal */}
        <Modal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
          postId={post.id} // Pass the post ID to the Modal
        />
      </div>
    </div>
  );
}
