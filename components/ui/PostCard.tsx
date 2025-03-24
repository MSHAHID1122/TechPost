// components/PostCard.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  ThumbsUp,
  UserCircle,
  Clock,
  Facebook,
  Twitter,
  MessageCircle,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function PostCard({
  post,
  onLike,
  isLiking,
}: {
  post: any;
  onLike: () => void;
  isLiking: boolean;
}) {
  // Generate the post URL
  const postUrl = `${window.location.origin}/posts/${post.id}`;

  // Share to Facebook
  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      postUrl
    )}`;
    window.open(url, "_blank");
  };

  // Share to Twitter
  const shareToTwitter = () => {
    const text = `Check out this post: ${post.title}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}&url=${encodeURIComponent(postUrl)}`;
    window.open(url, "_blank");
  };

  // Share to WhatsApp
  const shareToWhatsApp = () => {
    const text = `Check out this post: ${post.title} - ${postUrl}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <Card className="mb-8 overflow-hidden shadow-lg max-w-5xl max-h-fit">
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
      <CardFooter className="bg-gray-200 p-6 flex flex-col items-start gap-4">
        {/* Like Button */}
        <Button
          onClick={onLike}
          disabled={isLiking}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white"
        >
          <ThumbsUp className="h-4 w-4" />
          <span>Like ({post.likes_count})</span>
        </Button>

        {/* Share Buttons */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={shareToFacebook}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Facebook className="h-4 w-4" />
            <span>Share on Facebook</span>
          </Button>
          <Button
            onClick={shareToTwitter}
            className="flex items-center gap-2 bg-blue-400 hover:bg-blue-500 text-white"
          >
            <Twitter className="h-4 w-4" />
            <span>Tweet</span>
          </Button>
          <Button
            onClick={shareToWhatsApp}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Share on WhatsApp</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
