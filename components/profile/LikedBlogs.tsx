"use client"

import { Heart, Calendar, User } from "lucide-react"
import {Badge} from "@/components/ui/badge"

type Blog = {
  id: string
  title: string
  author: string
  date: string
  likes: number
  excerpt?: string
}

const SAMPLE_LIKED_BLOGS: Blog[] = [
  { 
    id: "b1", 
    title: "Mastering Integration Techniques", 
    author: "Dr. Sharma", 
    date: "2024-01-10", 
    likes: 234,
    excerpt: "Learn advanced integration methods including substitution, integration by parts, and partial fractions..."
  },
  { 
    id: "b2", 
    title: "Organic Chemistry Made Easy", 
    author: "Prof. Patel", 
    date: "2024-01-05", 
    likes: 189,
    excerpt: "A comprehensive guide to understanding organic chemistry reactions and mechanisms..."
  },
  { 
    id: "b3", 
    title: "Physics Problem Solving Strategies", 
    author: "Dr. Kumar", 
    date: "2023-12-28", 
    likes: 312,
    excerpt: "Master the art of solving complex physics problems with these proven strategies..."
  },
]

export default function LikedBlogs() {
  return (
    <div className="space-y-2 sm:space-y-3">
      {SAMPLE_LIKED_BLOGS.length === 0 ? (
        <div className="rounded-md border border-border p-6 sm:p-8 text-center text-muted-foreground">
          <p className="text-sm sm:text-base">No liked blogs yet</p>
          <p className="text-xs sm:text-sm mt-1">Like blogs to see them here</p>
        </div>
      ) : (
        SAMPLE_LIKED_BLOGS.map((blog) => (
          <article
            key={blog.id}
            className="rounded-md border border-border p-3 sm:p-4 hover:bg-muted/5 transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between gap-2 sm:gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-base font-medium mb-1 sm:mb-2 line-clamp-2">{blog.title}</h3>
                {blog.excerpt && (
                  <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3 line-clamp-2">
                    {blog.excerpt}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{blog.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 flex-shrink-0" />
                    <span>{new Date(blog.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="h-3 w-3 fill-red-500 text-red-500 flex-shrink-0" />
                    <span>{blog.likes} likes</span>
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))
      )}
    </div>
  )
}
