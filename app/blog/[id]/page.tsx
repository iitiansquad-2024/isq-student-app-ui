"use client";

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Calendar, 
  Clock, 
  Heart, 
  Share2, 
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
  XCircle,
  Headphones,
  Play,
  Pause,
  RotateCcw,
  Square,
  FileText,
  List
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
  const [likes, setLikes] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasAudioStarted, setHasAudioStarted] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'mostLiked'>('newest');
  const [showComments, setShowComments] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<{[key: number]: number}>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const [showTOC, setShowTOC] = useState(true);
  const [isTOCVisible, setIsTOCVisible] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);
  const tocRef = useRef<HTMLDivElement>(null);
  const isClickScrolling = useRef(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const articleEndRef = useRef<HTMLDivElement>(null);

  const post = MOCK_BLOG_POSTS.find(p => p.id === params.id);
  const quizQuestions: QuizQuestion[] = post ? (MOCK_QUIZ_QUESTIONS[post.id] || []) : [];

  useEffect(() => {
    if (post) {
      setLikes(post.likes);
    }
  }, [post]);

  // Extract headings for Table of Contents
  const extractHeadings = (content: string) => {
    const lines = content.trim().split('\n');
    const headings: { id: string; text: string; level: number }[] = [];
    
    lines.forEach((line, index) => {
      if (line.startsWith('# ')) {
        const text = line.substring(2).trim();
        headings.push({ id: `heading-${index}`, text, level: 1 });
      } else if (line.startsWith('## ')) {
        const text = line.substring(3).trim();
        headings.push({ id: `heading-${index}`, text, level: 2 });
      } else if (line.startsWith('### ')) {
        const text = line.substring(4).trim();
        headings.push({ id: `heading-${index}`, text, level: 3 });
      }
    });
    
    return headings;
  };

  const tableOfContents = post ? extractHeadings(post.content) : [];

  // Scroll to section
  const scrollToSection = (id: string) => {
    isClickScrolling.current = true;
    setActiveSection(id);
    
    const element = document.getElementById(id);
    if (element) {
      const offset = 120;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      setTimeout(() => {
        if (tocRef.current) {
          const activeButton = tocRef.current.querySelector(`button[data-heading-id="${id}"]`);
          if (activeButton) {
            activeButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      }, 100);
      
      setTimeout(() => {
        isClickScrolling.current = false;
      }, 1000);
    }
  };

  // Track active section on scroll
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (isClickScrolling.current) return;
      
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const headingElements = tableOfContents.map(h => ({
            id: h.id,
            element: document.getElementById(h.id)
          }));
          
          const scrollPosition = window.scrollY + 200;
          let currentSection = '';
          
          for (let i = 0; i < headingElements.length; i++) {
            const { id, element } = headingElements[i];
            if (element && element.offsetTop <= scrollPosition) {
              currentSection = id;
            } else {
              break;
            }
          }

          if (currentSection && currentSection !== activeSection) {
            setActiveSection(currentSection);
            
            if (tocRef.current) {
              const activeButton = tocRef.current.querySelector(`button[data-heading-id="${currentSection}"]`);
              if (activeButton) {
                activeButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }
          }
          
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection, tableOfContents]);

  // Hide TOC when scrolling past article
  useEffect(() => {
    const handleTOCVisibility = () => {
      if (articleEndRef.current) {
        const articleEnd = articleEndRef.current.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (articleEnd < windowHeight * 0.3) {
          setIsTOCVisible(false);
        } else {
          setIsTOCVisible(true);
        }
      }
    };

    window.addEventListener('scroll', handleTOCVisibility, { passive: true });
    handleTOCVisibility();
    
    return () => window.removeEventListener('scroll', handleTOCVisibility);
  }, []);

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

  const handlePlayPause = () => {
    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    } else {
      if (window.speechSynthesis.paused && hasAudioStarted) {
        window.speechSynthesis.resume();
        setIsPlaying(true);
      } else {
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.cancel();
        }
        
        const utterance = new SpeechSynthesisUtterance(post.content);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        utterance.onstart = () => {
          setHasAudioStarted(true);
          setIsPlaying(true);
        };
        
        utterance.onend = () => {
          setIsPlaying(false);
          setHasAudioStarted(false);
          utteranceRef.current = null;
        };
        
        utterance.onerror = (error) => {
          if (error.error !== 'canceled' && error.error !== 'interrupted') {
            console.error('Audio error:', error);
          }
        };
        
        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const handleRestart = () => {
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(post.content);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    utterance.onstart = () => {
      setHasAudioStarted(true);
      setIsPlaying(true);
    };
    
    utterance.onend = () => {
      setIsPlaying(false);
      setHasAudioStarted(false);
      utteranceRef.current = null;
    };
    
    utterance.onerror = (error) => {
      if (error.error !== 'canceled' && error.error !== 'interrupted') {
        console.error('Audio error:', error);
      }
    };
    
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setHasAudioStarted(false);
    utteranceRef.current = null;
  };

  const generateSummary = () => {
    return [
      '🎯 **Key Points**: Main concepts and strategies covered in the article',
      '⏰ **Time Management**: Effective planning and scheduling tips',
      '📚 **Study Focus**: Important topics and areas to concentrate on',
      '💡 **Success Tips**: Practical advice from experts and toppers',
      '🚫 **Common Mistakes**: Things to avoid during preparation'
    ];
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
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Sticky Header - Only Back Button */}
      <div className="sticky top-0 z-30 bg-background border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/blog')}
            className="hover:bg-accent"
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
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex items-center gap-4 mb-6">
            <Avatar 
              src={post.author.avatar} 
              name={post.author.name}
              size={48}
            />
            <div className="flex-1">
              <div className="text-base font-semibold text-foreground">{post.author.name}</div>
              <div className="text-sm text-muted-foreground">{post.author.credentials}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
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
          <div className="flex items-center justify-between border-t border-b border-border py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={`flex items-center space-x-2 ${isLiked ? 'text-red-500' : 'text-muted-foreground'}`}
              >
                <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                <span>{likes}</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2 text-muted-foreground"
                onClick={() => document.getElementById('comments-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <MessageCircle className="h-5 w-5" />
                <span>{comments.length}</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePlayPause}
                className="flex items-center space-x-2 text-muted-foreground hover:text-yellow-600"
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                <span>{isPlaying ? 'Pause' : 'Listen'}</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSummary(!showSummary)}
                className="flex items-center space-x-2 text-muted-foreground hover:text-yellow-600"
              >
                <FileText className="h-5 w-5" />
                <span>Summary</span>
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="text-muted-foreground"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Article Summary */}
        {showSummary && (
          <Card className="mb-8 border-yellow-400/20 bg-yellow-50 dark:bg-yellow-950/20">
            <CardHeader>
              <CardTitle className="flex items-center text-foreground">
                <FileText className="h-5 w-5 mr-2" />
                Article Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {generateSummary().map((point, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <span className="text-foreground font-medium text-sm">{point.split(' ')[0]}</span>
                    <span className="text-muted-foreground text-sm">{point.substring(point.indexOf(' ') + 1)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Audio Player Info */}
        {hasAudioStarted && (
          <Card className="mb-8 border-yellow-400/20 bg-yellow-50 dark:bg-yellow-950/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Headphones className="h-5 w-5 text-yellow-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {isPlaying ? 'Audio Playback Active' : 'Audio Paused'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isPlaying 
                      ? 'Article is being read aloud.' 
                      : 'Paused - Click play to resume from where you left off.'}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={handlePlayPause}
                    title={isPlaying ? 'Pause' : 'Resume'}
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={handleRestart}
                    title="Restart from beginning"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={handleStop} 
                    title="Stop"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Square className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content with TOC */}
        <div className="relative">
          {/* Table of Contents - Desktop Sidebar */}
          {tableOfContents.length > 0 && isTOCVisible && (
            <div className="hidden xl:block">
              <div className="fixed top-32 right-8 w-64 max-h-[calc(100vh-200px)] overflow-y-auto transition-opacity duration-300" ref={tocRef}>
                <Card className="border-yellow-400/20 dark:bg-card">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-semibold text-foreground flex items-center">
                        <List className="h-4 w-4 mr-2" />
                        Table of Contents
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowTOC(!showTOC)}
                        className="h-6 w-6 p-0"
                      >
                        {showTOC ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </Button>
                    </div>
                  </CardHeader>
                  {showTOC && (
                    <CardContent className="pt-0">
                      <nav className="space-y-1">
                        {tableOfContents.map((heading) => (
                          <button
                            key={heading.id}
                            data-heading-id={heading.id}
                            onClick={() => scrollToSection(heading.id)}
                            className={`
                              w-full text-left text-sm py-1.5 px-2 rounded transition-colors
                              ${heading.level === 1 ? 'font-semibold' : ''}
                              ${heading.level === 2 ? 'pl-4 font-medium' : ''}
                              ${heading.level === 3 ? 'pl-6 text-xs' : ''}
                              ${activeSection === heading.id 
                                ? 'bg-yellow-400 text-gray-900 font-semibold' 
                                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                              }
                            `}
                          >
                            {heading.text}
                          </button>
                        ))}
                      </nav>
                    </CardContent>
                  )}
                </Card>
              </div>
            </div>
          )}

          {/* Mobile TOC */}
          {tableOfContents.length > 0 && (
            <div className="xl:hidden mb-6">
              <Card className="border-yellow-400/20 dark:bg-card">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between cursor-pointer" onClick={() => setShowTOC(!showTOC)}>
                    <CardTitle className="text-sm font-semibold text-foreground flex items-center">
                      <List className="h-4 w-4 mr-2" />
                      Table of Contents
                    </CardTitle>
                    {showTOC ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </CardHeader>
                {showTOC && (
                  <CardContent className="pt-0">
                    <nav className="space-y-1">
                      {tableOfContents.map((heading) => (
                        <button
                          key={heading.id}
                          data-heading-id={heading.id}
                          onClick={() => scrollToSection(heading.id)}
                          className={`
                            w-full text-left text-sm py-1.5 px-2 rounded transition-colors
                            ${heading.level === 1 ? 'font-semibold' : ''}
                            ${heading.level === 2 ? 'pl-4 font-medium' : ''}
                            ${heading.level === 3 ? 'pl-6 text-xs' : ''}
                            ${activeSection === heading.id 
                              ? 'bg-yellow-400 text-gray-900 font-semibold' 
                              : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                            }
                          `}
                        >
                          {heading.text}
                        </button>
                      ))}
                    </nav>
                  </CardContent>
                )}
              </Card>
            </div>
          )}

          {/* Article Content */}
          <div className="mb-12" ref={contentRef}>
            <MarkdownRenderer content={post.content} />
          </div>
          <div ref={articleEndRef}></div>
        </div>

        {/* Tags */}
        <div className="mb-8">
          <div className="flex items-center gap-2 flex-wrap">
            <Tag className="h-4 w-4 text-muted-foreground" />
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-sm">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <Separator className="my-8" />

        {/* Author Bio */}
        <div className="bg-muted rounded-lg p-6 mb-12">
          <div className="flex items-start gap-4">
            <Avatar 
              src={post.author.avatar} 
              name={post.author.name}
              size={64}
              className="flex-shrink-0"
            />
            <div className="flex-1">
              <div className="text-lg font-semibold text-foreground mb-1">{post.author.name}</div>
              <div className="text-sm text-muted-foreground mb-2">{post.author.credentials}</div>
              <p className="text-foreground">{post.author.bio}</p>
            </div>
          </div>
        </div>

        {/* Comments Section - Collapsible */}
        <div className="mb-12" id="comments-section">
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center justify-between w-full mb-6 group"
          >
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <MessageCircle className="h-6 w-6" />
              Comments ({comments.length})
            </h2>
            {showComments ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>

          {showComments && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="text-sm text-muted-foreground">Sort by:</span>
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
              <div key={comment.id} className="bg-card rounded-lg p-4 border border-border">
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
                        <div className="font-semibold text-foreground">{comment.author.name}</div>
                        <div className="text-xs text-muted-foreground">{formatTimeAgo(comment.timestamp)}</div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-foreground mb-3">{comment.content}</p>
                    <div className="flex items-center gap-4">
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-red-500">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        {comment.likes}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-muted-foreground"
                        onClick={() => setReplyingTo(comment.id)}
                      >
                        Reply
                      </Button>
                    </div>

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-4 ml-6 space-y-4">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="bg-muted rounded-lg p-3">
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
                                    <div className="font-semibold text-sm text-foreground">{reply.author.name}</div>
                                    <div className="text-xs text-muted-foreground">{formatTimeAgo(reply.timestamp)}</div>
                                  </div>
                                </div>
                                <p className="text-sm text-foreground mb-2">{reply.content}</p>
                                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-red-500">
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
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Brain className="h-6 w-6" />
              Test Your Knowledge
            </h2>
            {showQuiz ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>

          {showQuiz && (
            <div className="space-y-6">
              {quizQuestions.map((question, qIndex) => (
                <div key={qIndex} className="bg-card rounded-lg p-6 border border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
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
                              ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
                              : showResult && isSelected && !isCorrect
                              ? 'border-red-500 bg-red-50 dark:bg-red-950/20'
                              : isSelected
                              ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-950/20'
                              : 'border-border hover:border-border'
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
                <div className="text-sm text-muted-foreground">
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
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
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
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {relatedPost.excerpt}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
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
