"use client";

import { useState } from "react";
import {
  ThumbsUp,
  ThumbsDown,
  Flag,
  MoreVertical,
  Image as ImageIcon,
  Send,
  MessageSquare,
} from "lucide-react";
import Avatar from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { CollapsibleCard } from "@/components/ui/collapsible-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface User {
  id: string;
  name: string;
  xp: number;
  avatarUrl?: string | null;
}

interface Solution {
  id: string;
  user: User;
  content: string;
  images?: string[];
  timestamp: string;
  likes: number;
  userLiked?: boolean;
  replies: Solution[];
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
];

const SAMPLE_SOLUTIONS: Solution[] = [
  {
    id: "s1",
    user: SAMPLE_USERS[0],
    content: `Here's a step-by-step solution:

1. First, recall the power rule: d/dx(x^n) = nx^(n-1)
2. In this case, n = 2
3. Therefore, d/dx(x^2) = 2x^(2-1) = 2x

This is why the answer is 2x.`,
    timestamp: "2024-01-13T12:00:00Z",
    likes: 24,
    replies: [],
  },
  {
    id: "s2",
    user: SAMPLE_USERS[1],
    content: "Alternative approach using first principles:\n\nlim(h→0) [f(x+h) - f(x)]/h\n= lim(h→0) [(x+h)² - x²]/h\n= lim(h→0) [x² + 2xh + h² - x²]/h\n= lim(h→0) [2xh + h²]/h\n= lim(h→0) [2x + h]\n= 2x",
    timestamp: "2024-01-13T13:00:00Z",
    likes: 18,
    replies: [],
  },
];

function SolutionCard({ solution }: { solution: Solution }) {
  const [vote, setVote] = useState<"up" | "down" | null>(null);
  const [likes, setLikes] = useState(solution.likes);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState("");

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
    <CollapsibleCard
      title={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <Avatar name={solution.user.name} size={32} />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{solution.user.name}</span>
                <Badge variant="secondary" className="text-xs">{solution.user.xp} XP</Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                {new Date(solution.timestamp).toLocaleDateString()}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
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
            </div>
            <Button variant="ghost" size="sm" className="h-8 px-2">
              <Flag className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="whitespace-pre-wrap text-sm">{solution.content}</div>
        {solution.images?.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`Solution image ${idx + 1}`}
            className="rounded-md max-h-96 object-contain"
          />
        ))}

        {solution.replies.map((reply) => (
          <div key={reply.id} className="mt-4 pl-8 border-l-2 border-border">
            <div className="flex items-center gap-2 mb-2">
              <Avatar name={reply.user.name} size={24} />
              <span className="text-sm font-medium">{reply.user.name}</span>
              <Badge variant="secondary" className="text-xs">{reply.user.xp} XP</Badge>
            </div>
            <div className="whitespace-pre-wrap text-sm">{reply.content}</div>
            <div className="flex items-center gap-2 mt-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2"
                onClick={() => {
                  // Handle reply like
                }}
              >
                <ThumbsUp className="h-3 w-3" />
                <span className="ml-1 text-xs">{reply.likes}</span>
              </Button>
            </div>
          </div>
        ))}

        {!showReplyInput && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowReplyInput(true)}
            className="mt-2"
          >
            <MessageSquare className="h-4 w-4 mr-1" />
            Add Reply
          </Button>
        )}

        {showReplyInput && (
          <div className="mt-4">
            <textarea
              rows={3}
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write your reply..."
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="mt-2 flex items-center justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowReplyInput(false);
                  setReplyContent("");
                }}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={!replyContent.trim()}
                onClick={() => {
                  // Handle reply submit
                  setShowReplyInput(false);
                  setReplyContent("");
                }}
              >
                Reply
              </Button>
            </div>
          </div>
        )}
      </div>
    </CollapsibleCard>
  );
}

export function Solutions() {
  const [content, setContent] = useState("");
  const [images, setImages] = useState<string[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages([...images, reader.result as string]);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Solution */}
      <CollapsibleCard title="Add Your Solution" defaultExpanded={false}>
        <div className="space-y-4">
          <textarea
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your solution..."
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          
          {images.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Upload ${idx + 1}`}
                  className="rounded-md h-32 w-full object-cover"
                />
              ))}
            </div>
          )}

          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <ImageIcon className="h-4 w-4 mr-2" />
              Add Image
            </Button>
            <Button size="sm" disabled={!content.trim()}>
              <Send className="h-4 w-4 mr-2" />
              Submit
            </Button>
          </div>
        </div>
      </CollapsibleCard>

      {/* Solutions List */}
      <div className="space-y-4">
        {SAMPLE_SOLUTIONS.map((solution) => (
          <SolutionCard key={solution.id} solution={solution} />
        ))}
      </div>
    </div>
  );
}
