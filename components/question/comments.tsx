"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Flag,
  MoreVertical,
} from "lucide-react";
import Avatar from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface User {
  id: string;
  name: string;
  xp: number;
  avatarUrl?: string | null;
}

interface Comment {
  id: string;
  user: User;
  content: string;
  timestamp: string;
  likes: number;
  userLiked?: boolean;
  replies: Comment[];
}

const SAMPLE_USERS: User[] = [
  {
    id: "u1",
    name: "Aisha Khan",
    xp: 2500,
  },
  {
    id: "u2",
    name: "Ravi Patel",
    xp: 1800,
  },
  {
    id: "u3",
    name: "Maya Rao",
    xp: 3200,
  },
];

const SAMPLE_COMMENTS: Comment[] = [
  {
    id: "c1",
    user: SAMPLE_USERS[0],
    content: "This is a great explanation! I was stuck on the power rule but now it's clear.",
    timestamp: "2024-01-13T12:00:00Z",
    likes: 12,
    replies: [
      {
        id: "c1r1",
        user: SAMPLE_USERS[1],
        content: "Agreed! The step-by-step breakdown really helps.",
        timestamp: "2024-01-13T12:30:00Z",
        likes: 5,
        replies: [],
      },
    ],
  },
  {
    id: "c2",
    user: SAMPLE_USERS[2],
    content: "Could someone explain why we don't consider the constant term here?",
    timestamp: "2024-01-13T13:00:00Z",
    likes: 8,
    replies: [],
  },
];

function CommentCard({ comment, depth = 0 }: { comment: Comment; depth?: number }) {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [vote, setVote] = useState<"up" | "down" | null>(null);
  const [likes, setLikes] = useState(comment.likes);

  const handleVote = (type: "up" | "down") => {
    if (vote === type) {
      setVote(null);
      setLikes(prev => prev + (type === "up" ? -1 : 1));
    } else {
      if (vote) {
        // Remove previous vote
        setLikes(prev => prev + (vote === "up" ? -1 : 1));
      }
      setVote(type);
      setLikes(prev => prev + (type === "up" ? 1 : -1));
    }
  };

  return (
    <div className={cn("space-y-3", depth > 0 && "ml-8 pt-3")}>
      <div className="flex items-start gap-3">
        <Avatar name={comment.user.name} size={32} />
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{comment.user.name}</span>
            <Badge variant="secondary" className="text-xs">{comment.user.xp} XP</Badge>
            <span className="text-xs text-muted-foreground">
              {new Date(comment.timestamp).toLocaleDateString()}
            </span>
          </div>
          <p className="text-sm">{comment.content}</p>
          <div className="flex items-center gap-4 pt-1">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2"
                onClick={() => handleVote("up")}
              >
                <ThumbsUp
                  className={cn("h-4 w-4", vote === "up" && "fill-current text-primary")}
                />
              </Button>
              <span className="text-xs">{likes}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2"
                onClick={() => handleVote("down")}
              >
                <ThumbsDown
                  className={cn("h-4 w-4", vote === "down" && "fill-current text-destructive")}
                />
              </Button>
            </div>
            {depth === 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2"
                onClick={() => setShowReplyInput(!showReplyInput)}
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                <span className="text-xs">Reply</span>
              </Button>
            )}
            <Button variant="ghost" size="sm" className="h-8 px-2">
              <Flag className="h-4 w-4 mr-1" />
              <span className="text-xs">Report</span>
            </Button>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>

      {showReplyInput && (
        <div className="flex items-start gap-3 pl-8">
          <Avatar name="You" size={32} />
          <div className="flex-1">
            <textarea
              rows={2}
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write a reply..."
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="mt-2 flex items-center justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplyInput(false)}
              >
                Cancel
              </Button>
              <Button size="sm" disabled={!replyContent.trim()}>
                Reply
              </Button>
            </div>
          </div>
        </div>
      )}

      {comment.replies?.map((reply) => (
        <CommentCard key={reply.id} comment={reply} depth={depth + 1} />
      ))}
    </div>
  );
}

export function Comments() {
  const [content, setContent] = useState("");

  return (
    <div className="space-y-6">
      {/* New Comment Input */}
      <div className="flex items-start gap-3">
        <Avatar name="You" size={32} />
        <div className="flex-1">
          <textarea
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a comment..."
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="mt-2 flex items-center justify-end">
            <Button disabled={!content.trim()}>Comment</Button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {SAMPLE_COMMENTS.map((comment) => (
          <CommentCard key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}
