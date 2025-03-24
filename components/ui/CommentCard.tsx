// components/CommentCard.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { UserCircle, Clock } from "lucide-react";

export default function CommentCard({ comment }: { comment: any }) {
  return (
    <Card className="shadow-sm overflow-hidden bg-white dark:bg-gray-800">
      <CardContent className="pt-6 pb-4 px-6">
        <div className="flex items-center gap-4 flex-wrap mb-4">
          <UserCircle className="h-8 w-8 text-gray-500 dark:text-gray-400 flex-shrink-0" />
          <div className="min-w-0">
            <p className="font-semibold truncate text-gray-800 dark:text-gray-200">
              {comment.author?.name || "Anonymous"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
              <Clock className="h-4 w-4 mr-1 flex-shrink-0" />
              {new Date(comment.created_at).toLocaleDateString()}
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
          {comment.content}
        </p>
      </CardContent>
    </Card>
  );
}
