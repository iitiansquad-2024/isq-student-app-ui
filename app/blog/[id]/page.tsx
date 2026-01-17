"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Calendar, 
  Clock, 
  Heart, 
  Share2, 
  Bookmark, 
  ArrowLeft, 
  MessageCircle, 
  TrendingUp,
  Tag,
  ThumbsUp,
  Eye,
  Send,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  Brain,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Avatar from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { MOCK_BLOG_POSTS, MOCK_QUIZ_QUESTIONS, QuizQuestion } from '@/lib/blog-data';
import MarkdownRenderer from '@/components/ui/markdown-renderer';

interface Comment {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  replies?: Comment[];
}

const mockComments: Comment[] = [
  {
    id: '1',
    author: {
      name: 'Arjun Patel',
      avatar: '/avatars/arjun.jpg'
    },
    content: 'This is exactly what I needed! The time management tips are really practical.',
    timestamp: '2024-01-16T10:30:00Z',
    likes: 12,
    replies: [
      {
        id: '1-1',
        author: {
          name: 'Rahul Sharma',
          avatar: '/avatars/rahul.jpg'
        },
        content: 'Glad it helped! The key is consistency.',
        timestamp: '2024-01-16T11:15:00Z',
        likes: 5
      }
    ]
  },
  {
    id: '2',
    author: {
      name: 'Sneha Gupta',
      avatar: '/avatars/sneha.jpg'
    },
    content: 'The mock test strategy section is gold! Will definitely implement this.',
    timestamp: '2024-01-16T14:20:00Z',
    likes: 8
  },
  {
    id: '3',
    author: {
      name: 'Karan Singh',
      avatar: '/avatars/karan.jpg'
    },
    content: 'Can you write a detailed article on Physics problem-solving techniques?',
    timestamp: '2024-01-16T16:45:00Z',
    likes: 15
  }
];

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'mostLiked'>('newest');
  const [showComments, setShowComments] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<{[key: number]: number}>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const post = MOCK_BLOG_POSTS.find(p => p.id === params.id);
  const quizQuestions: QuizQuestion[] = post ? (MOCK_QUIZ_QUESTIONS[post.id] || []) : [];

  useEffect(() => {
    if (post) {
      setLikes(post.likes);
    }
  }, [post]);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Blog post not found</h1>
          <Button onClick={() => router.push('/blog')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Button>
        </div>
      </div>
    );
  }

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: {
        name: 'You',
        avatar: '/avatars/default.jpg'
      },
      content: newComment,
      timestamp: new Date().toISOString(),
      likes: 0
    };

    setComments([comment, ...comments]);
    setNewComment('');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const sortedComments = [...comments].sort((a, b) => {
    switch (sortBy) {
      case 'oldest':
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      case 'mostLiked':
        return b.likes - a.likes;
      case 'newest':
      default:
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    }
  });

  const relatedPosts = MOCK_BLOG_POSTS.filter(p => 
    p.id !== post.id && 
    (p.category === post.category || p.tags.some(tag => post.tags.includes(tag)))
  ).slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header - Only Back Button */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/blog')}
            className="hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to articles
          </Button>
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="mb-8">
          <Badge className="bg-yellow-400 text-gray-900 mb-4">
            {post.category}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex items-center gap-4 mb-6">
            <Avatar 
              src={post.author.avatar} 
              name={post.author.name}
              size={48}
            />
            <div className="flex-1">
              <div className="text-base font-semibold text-gray-900">{post.author.name}</div>
              <div className="text-sm text-gray-600">{post.author.credentials}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formatDate(post.publishedAt)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {post.readTime} min read
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {post.views.toLocaleString()} views
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Button
              variant={isLiked ? "default" : "outline"}
              size="sm"
              onClick={handleLike}
              className={isLiked ? "bg-red-500 hover:bg-red-600 text-white" : ""}
            >
              <Heart className={`h-4 w-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
              {likes}
            </Button>
            <Button
              variant={isBookmarked ? "default" : "outline"}
              size="sm"
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={isBookmarked ? "bg-yellow-400 hover:bg-yellow-500 text-gray-900" : ""}
            >
              <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </header>

        <Separator className="my-8" />

        {/* Article Content */}
        <div className="mb-12">
          <MarkdownRenderer content={post.content} />
        </div>

        {/* Tags */}
        <div className="mb-8">
          <div className="flex items-center gap-2 flex-wrap">
            <Tag className="h-4 w-4 text-gray-500" />
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-sm">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <Separator className="my-8" />

        {/* Author Bio */}
        <div className="bg-gray-50 rounded-lg p-6 mb-12">
          <div className="flex items-start gap-4">
            <Avatar 
              src={post.author.avatar} 
              name={post.author.name}
              size={64}
              className="flex-shrink-0"
            />
            <div className="flex-1">
              <div className="text-lg font-semibold text-gray-900 mb-1">{post.author.name}</div>
              <div className="text-sm text-gray-600 mb-2">{post.author.credentials}</div>
              <p className="text-gray-700">{post.author.bio}</p>
            </div>
          </div>
        </div>

        {/* Comments Section - Collapsible */}
        <div className="mb-12">
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center justify-between w-full mb-6 group"
          >
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <MessageCircle className="h-6 w-6" />
              Comments ({comments.length})
            </h2>
            {showComments ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>

          {showComments && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="text-sm border rounded-md px-3 py-1"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="mostLiked">Most Liked</option>
                </select>
              </div>

              {/* Comment Form */}
              <form onSubmit={handleCommentSubmit} className="mb-8">
            <Textarea
              placeholder="Share your thoughts..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="mb-3"
              rows={3}
            />
            <div className="flex justify-end">
              <Button type="submit" className="bg-yellow-400 text-gray-900 hover:bg-yellow-500">
                <Send className="h-4 w-4 mr-2" />
                Post Comment
              </Button>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-6">
            {sortedComments.map((comment) => (
              <div key={comment.id} className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-start gap-3">
                  <Avatar 
                    src={comment.author.avatar} 
                    name={comment.author.name}
                    size={40}
                    className="flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="font-semibold text-gray-900">{comment.author.name}</div>
                        <div className="text-xs text-gray-500">{formatTimeAgo(comment.timestamp)}</div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-gray-700 mb-3">{comment.content}</p>
                    <div className="flex items-center gap-4">
                      <Button variant="ghost" size="sm" className="text-gray-600 hover:text-red-500">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        {comment.likes}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-gray-600"
                        onClick={() => setReplyingTo(comment.id)}
                      >
                        Reply
                      </Button>
                    </div>

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-4 ml-6 space-y-4">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-start gap-3">
                              <Avatar 
                                src={reply.author.avatar} 
                                name={reply.author.name}
                                size={32}
                                className="flex-shrink-0"
                              />
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <div>
                                    <div className="font-semibold text-sm text-gray-900">{reply.author.name}</div>
                                    <div className="text-xs text-gray-500">{formatTimeAgo(reply.timestamp)}</div>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-700 mb-2">{reply.content}</p>
                                <Button variant="ghost" size="sm" className="text-xs text-gray-600 hover:text-red-500">
                                  <ThumbsUp className="h-3 w-3 mr-1" />
                                  {reply.likes}
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
              </div>
            </div>
          )}
        </div>

        {/* Quiz Section - Collapsible */}
        {quizQuestions.length > 0 && (
          <div className="mb-12">
          <button
            onClick={() => setShowQuiz(!showQuiz)}
            className="flex items-center justify-between w-full mb-6 group"
          >
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Brain className="h-6 w-6" />
              Test Your Knowledge
            </h2>
            {showQuiz ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>

          {showQuiz && (
            <div className="space-y-6">
              {quizQuestions.map((question, qIndex) => (
                <div key={qIndex} className="bg-white rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {qIndex + 1}. {question.question}
                  </h3>
                  <div className="space-y-3">
                    {question.options.map((option, oIndex) => {
                      const isSelected = quizAnswers[qIndex] === oIndex;
                      const isCorrect = question.correctAnswer === oIndex;
                      const showResult = quizSubmitted;
                      
                      return (
                        <button
                          key={oIndex}
                          onClick={() => !quizSubmitted && setQuizAnswers({...quizAnswers, [qIndex]: oIndex})}
                          disabled={quizSubmitted}
                          className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                            showResult && isCorrect
                              ? 'border-green-500 bg-green-50'
                              : showResult && isSelected && !isCorrect
                              ? 'border-red-500 bg-red-50'
                              : isSelected
                              ? 'border-yellow-400 bg-yellow-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{option}</span>
                            {showResult && isCorrect && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                            {showResult && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-red-600" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {quizSubmitted ? (
                    <span className="font-semibold">
                      Score: {Object.values(quizAnswers).filter((ans, idx) => ans === quizQuestions[idx].correctAnswer).length} / {quizQuestions.length}
                    </span>
                  ) : (
                    <span>Answered: {Object.keys(quizAnswers).length} / {quizQuestions.length}</span>
                  )}
                </div>
                {!quizSubmitted ? (
                  <Button
                    onClick={() => setQuizSubmitted(true)}
                    disabled={Object.keys(quizAnswers).length !== quizQuestions.length}
                    className="bg-yellow-400 text-gray-900 hover:bg-yellow-500"
                  >
                    Submit Quiz
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      setQuizAnswers({});
                      setQuizSubmitted(false);
                    }}
                    variant="outline"
                  >
                    Retry Quiz
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
        )}

        {relatedPosts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <TrendingUp className="h-6 w-6" />
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.id} href={`/blog/${relatedPost.id}`} className="group">
                  <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardHeader>
                      <Badge className="bg-yellow-400 text-gray-900 mb-2 w-fit">
                        {relatedPost.category}
                      </Badge>
                      <CardTitle className="text-base group-hover:text-yellow-600 transition-colors line-clamp-2">
                        {relatedPost.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {relatedPost.excerpt}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        {relatedPost.readTime} min
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
