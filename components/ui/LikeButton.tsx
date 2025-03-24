// components/LikeButton.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThumbsUp } from "lucide-react";
import { toast } from "sonner";

interface LikeButtonProps {
  initialLikes: number;
  postId: number;
  userId: string; // Pass the current user's ID
}

export default function LikeButton({
  initialLikes,
  postId,
  userId,
}: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  // Check if the user has already liked the post
  useEffect(() => {
    const checkUserLikeStatus = async () => {
      try {
        const response = await fetch(
          `/api/posts/${postId}/like-status?userId=${userId}`
        );
        if (response.ok) {
          const data = await response.json();
          setIsLiked(data.hasLiked);
        } else {
          console.error("Failed to fetch like status");
        }
      } catch (error) {
        console.error("Error fetching like status:", error);
      }
    };

    checkUserLikeStatus();
  }, [postId, userId]);

  const handleLike = async () => {
    if (isLiked || isDisabled) {
      toast.info("You have already liked this post.");
      return;
    }

    setIsDisabled(true);

    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        setLikes(likes + 1);
        setIsLiked(true);
        toast.success("Post liked!");
      } else {
        toast.error("Failed to like the post.");
      }
    } catch (error) {
      console.error("Error updating like:", error);
      toast.error("An error occurred while liking the post.");
    } finally {
      setIsDisabled(false);
    }
  };

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.1 },
    tap: { scale: 0.9 },
  };

  const countVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
  };

  return (
    <div className="flex items-center space-x-4">
      <motion.button
        variants={buttonVariants}
        initial="idle"
        whileHover="hover"
        whileTap="tap"
        onClick={handleLike}
        className={`flex items-center space-x-1 p-2 rounded-full transition-colors duration-300 ${
          isLiked ? "bg-purple-600 text-white" : "bg-gray-200 dark:bg-gray-700"
        }`}
        disabled={isLiked || isDisabled}
      >
        <ThumbsUp size={20} />
        <AnimatePresence mode="wait">
          <motion.span
            key={likes}
            variants={countVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            {likes}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
