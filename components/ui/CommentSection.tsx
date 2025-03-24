// components/CommentSection.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare } from "lucide-react";
import CommentCard from "./CommentCard";

export default function CommentSection({
  comments,
  onComment,
  isCommenting,
  currentUser,
}: {
  comments: any[];
  onComment: (comment: string) => void;
  isCommenting: boolean;
  currentUser: any;
}) {
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    onComment(comment);
    setComment("");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
        Comments
      </h2>
      <div className="space-y-4">
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment..."
          className="min-h-[100px] w-full max-w-full font-sans text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-4"
          disabled={!currentUser}
        />
        <Button
          onClick={handleSubmit}
          disabled={isCommenting || !currentUser}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          {isCommenting ? "Posting..." : "Post Comment"}
        </Button>
      </div>

      <div className="space-y-4">
        {comments.map((c) => (
          <CommentCard key={c.id} comment={c} />
        ))}
      </div>
    </div>
  );
}
