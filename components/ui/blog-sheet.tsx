"use client"

import { useState, useEffect, useRef, useMemo } from 'react'
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle 
} from './sheet'
import { Button } from './button'
import { Input } from './input'
import { Badge } from './badge'
import Avatar from './avatar'
import { Textarea } from '@/components/ui/textarea'
import { 
  Search, 
  Calendar, 
  Clock, 
  Eye, 
  Heart, 
  Share2, 
  Bookmark, 
  ArrowLeft, 
  Play, 
  Pause, 
  Square,
  RotateCcw,
  Brain,
  Sparkles,
  CheckCircle2,
  XCircle,
  Award,
  Loader2,
  Tag,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  List,
  FileText,
  Headphones
} from 'lucide-react'
import { BlogPost, BLOG_CATEGORIES, MOCK_BLOG_POSTS, MOCK_QUIZ_QUESTIONS, QuizQuestion } from '@/lib/blog-data'
import { Card, CardContent, CardHeader, CardTitle } from './card'

interface BlogSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BlogSheet({ open, onOpenChange }: BlogSheetProps) {
  const [view, setView] = useState<'list' | 'detail'>('list')
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [likes, setLikes] = useState(0)
  
  // Audio playback state
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasAudioStarted, setHasAudioStarted] = useState(false)
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null)
  
  // Quiz state
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([])
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false)
  
  // Table of contents
  const [showTOC, setShowTOC] = useState(true)
  const [activeSection, setActiveSection] = useState<string>('')
  const [showSummary, setShowSummary] = useState(false)
  
  const contentRef = useRef<HTMLDivElement>(null)

  const filteredPosts = useMemo(() => {
    let filtered = MOCK_BLOG_POSTS

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(post => post.category === selectedCategory)
    }

    if (searchQuery) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    return filtered
  }, [selectedCategory, searchQuery])

  const handlePostClick = (post: BlogPost) => {
    setSelectedPost(post)
    setLikes(post.likes)
    setView('detail')
    setIsLiked(false)
    setIsBookmarked(false)
    setShowQuiz(false)
    setQuizAnswers({})
    setQuizSubmitted(false)
    setShowSummary(false)
    stopAudio()
  }

  const handleBack = () => {
    setView('list')
    setSelectedPost(null)
    stopAudio()
    setShowQuiz(false)
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikes(prev => isLiked ? prev - 1 : prev + 1)
  }

  const handleShare = () => {
    if (navigator.share && selectedPost) {
      navigator.share({
        title: selectedPost.title,
        text: selectedPost.excerpt,
        url: window.location.href
      })
    }
  }

  // Audio functions
  const stopAudio = () => {
    if (speechSynthesisRef.current) {
      window.speechSynthesis.cancel()
      setIsPlaying(false)
      setHasAudioStarted(false)
      speechSynthesisRef.current = null
    }
  }

  const handlePlayPause = () => {
    if (!selectedPost) return

    if (isPlaying) {
      window.speechSynthesis.pause()
      setIsPlaying(false)
    } else {
      if (!hasAudioStarted) {
        const utterance = new SpeechSynthesisUtterance(selectedPost.content)
        utterance.rate = 1.0
        utterance.pitch = 1.0
        utterance.volume = 1.0
        
        utterance.onend = () => {
          setIsPlaying(false)
          setHasAudioStarted(false)
        }
        
        speechSynthesisRef.current = utterance
        window.speechSynthesis.speak(utterance)
        setHasAudioStarted(true)
        setIsPlaying(true)
      } else {
        window.speechSynthesis.resume()
        setIsPlaying(true)
      }
    }
  }

  const handleRestart = () => {
    stopAudio()
    setTimeout(() => handlePlayPause(), 100)
  }

  const handleStop = () => {
    stopAudio()
  }

  // Quiz functions
  const initializeQuiz = () => {
    if (!selectedPost) return
    
    const questions = MOCK_QUIZ_QUESTIONS[selectedPost.id] || []
    setQuizQuestions(questions)
    setShowQuiz(true)
    setQuizAnswers({})
    setQuizSubmitted(false)
  }

  const handleQuizAnswer = (questionIndex: number, answerIndex: number) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex.toString()
    }))
  }

  const handleQuizSubmit = () => {
    if (Object.keys(quizAnswers).length < quizQuestions.length) return
    setQuizSubmitted(true)
  }

  const getQuizScore = () => {
    let correct = 0
    quizQuestions.forEach((q, index) => {
      if (quizAnswers[index] === q.correctAnswer.toString()) {
        correct++
      }
    })
    return correct
  }

  const generateMoreQuestions = () => {
    setIsGeneratingQuestions(true)
    setTimeout(() => {
      const newQuestions: QuizQuestion[] = [
        {
          question: 'What is emphasized as the most important factor for success?',
          options: ['Intelligence', 'Consistency', 'Luck', 'Resources'],
          correctAnswer: 1
        },
        {
          question: 'Which approach is recommended for difficult topics?',
          options: ['Skip them', 'Memorize formulas', 'Understand concepts deeply', 'Practice only easy problems'],
          correctAnswer: 2
        },
        {
          question: 'What should be the primary focus during preparation?',
          options: ['Speed', 'Accuracy', 'Both speed and accuracy', 'Quantity of problems'],
          correctAnswer: 2
        },
        {
          question: 'How should mock tests be analyzed?',
          options: ['Just check the score', 'Review only wrong answers', 'Spend equal time analyzing as taking the test', 'Skip analysis'],
          correctAnswer: 2
        },
        {
          question: 'What is the recommended approach for mental health during preparation?',
          options: ['Study 24/7', 'Take regular breaks', 'Compare with others', 'Ignore stress'],
          correctAnswer: 1
        }
      ]
      
      setQuizQuestions(prev => [...prev, ...newQuestions])
      setIsGeneratingQuestions(false)
      setQuizSubmitted(false)
      setQuizAnswers({})
    }, 1500)
  }

  const generateSummary = () => {
    if (!selectedPost) return []
    
    const lines = selectedPost.content.split('\n').filter(line => line.trim())
    const headings = lines.filter(line => line.startsWith('##') && !line.startsWith('###'))
    return headings.slice(0, 5).map(h => h.replace(/^##\s*/, ''))
  }

  const extractTableOfContents = () => {
    if (!selectedPost) return []
    
    const lines = selectedPost.content.split('\n')
    const toc: Array<{ id: string; text: string; level: number }> = []
    
    lines.forEach((line, index) => {
      if (line.startsWith('# ')) {
        toc.push({ id: `heading-${index}`, text: line.substring(2), level: 1 })
      } else if (line.startsWith('## ')) {
        toc.push({ id: `heading-${index}`, text: line.substring(3), level: 2 })
      } else if (line.startsWith('### ')) {
        toc.push({ id: `heading-${index}`, text: line.substring(4), level: 3 })
      }
    })
    
    return toc
  }

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const renderContent = (content: string) => {
    const lines = content.trim().split('\n')
    const elements: React.ReactElement[] = []

    lines.forEach((line, index) => {
      if (line.startsWith('# ')) {
        elements.push(
          <h1 key={index} id={`heading-${index}`} className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 mt-6 scroll-mt-4">
            {line.substring(2)}
          </h1>
        )
      } else if (line.startsWith('## ')) {
        elements.push(
          <h2 key={index} id={`heading-${index}`} className="text-xl md:text-2xl font-bold text-gray-900 mb-3 mt-5 scroll-mt-4">
            {line.substring(3)}
          </h2>
        )
      } else if (line.startsWith('### ')) {
        elements.push(
          <h3 key={index} id={`heading-${index}`} className="text-lg md:text-xl font-semibold text-gray-800 mb-2 mt-4 scroll-mt-4">
            {line.substring(4)}
          </h3>
        )
      } else if (line.startsWith('**') && line.endsWith('**')) {
        elements.push(
          <h4 key={index} className="text-base md:text-lg font-semibold text-gray-800 mb-2 mt-3">
            {line.substring(2, line.length - 2)}
          </h4>
        )
      } else if (line.startsWith('*') && line.endsWith('*') && !line.startsWith('**')) {
        elements.push(
          <p key={index} className="text-gray-600 italic mb-3 pl-3 border-l-4 border-yellow-400 text-sm md:text-base">
            {line.substring(1, line.length - 1)}
          </p>
        )
      } else if (line.startsWith('- ')) {
        elements.push(
          <li key={index} className="text-gray-700 mb-2 ml-4 md:ml-6 text-sm md:text-base leading-relaxed">
            {line.substring(2)}
          </li>
        )
      } else if (line.match(/^\d+\./)) {
        elements.push(
          <li key={index} className="text-gray-700 mb-2 ml-4 md:ml-6 list-decimal text-sm md:text-base leading-relaxed">
            {line.substring(line.indexOf('.') + 2)}
          </li>
        )
      } else if (line.trim() === '') {
        // Skip empty lines
      } else {
        elements.push(
          <p key={index} className="text-gray-700 mb-3 leading-relaxed text-sm md:text-base">
            {line}
          </p>
        )
      }
    })

    return elements
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatViews = (views: number) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}k`
    }
    return views.toString()
  }

  useEffect(() => {
    return () => {
      stopAudio()
    }
  }, [])

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl p-0 overflow-hidden">
        {view === 'list' ? (
          <div className="flex flex-col h-full">
            <SheetHeader className="p-4 md:p-6 border-b bg-gradient-to-r from-yellow-50 to-yellow-100">
              <SheetTitle className="text-xl md:text-2xl font-bold text-gray-900">Expert Insights & Study Tips</SheetTitle>
              <p className="text-xs md:text-sm text-gray-600 mt-1">Learn from toppers and experts</p>
            </SheetHeader>

            <div className="p-4 md:p-6 border-b bg-white">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 text-sm"
                />
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {BLOG_CATEGORIES.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={`whitespace-nowrap text-xs ${
                      selectedCategory === category
                        ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-500'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6">
              {filteredPosts.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 md:h-16 md:w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-base md:text-lg font-semibold text-gray-600 mb-2">No articles found</h3>
                  <p className="text-xs md:text-sm text-gray-500">Try adjusting your search or filter</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredPosts.map((post) => (
                    <div
                      key={post.id}
                      onClick={() => handlePostClick(post)}
                      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all cursor-pointer group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                          <TrendingUp className="h-8 w-8 md:h-10 md:w-10 text-yellow-600" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <Badge className="bg-yellow-400 text-gray-900 mb-2 text-xs">
                            {post.category}
                          </Badge>
                          <h3 className="text-sm md:text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-yellow-600 transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-xs md:text-sm text-gray-600 mb-3 line-clamp-2">
                            {post.excerpt}
                          </p>
                          
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {post.readTime} min
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {formatViews(post.views)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="h-3 w-3" />
                              {post.likes}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="p-4 md:p-6 border-b bg-white sticky top-0 z-10">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="mb-3 -ml-2"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to articles
              </Button>
              
              {selectedPost && (
                <div>
                  <Badge className="bg-yellow-400 text-gray-900 mb-2 text-xs">
                    {selectedPost.category}
                  </Badge>
                  <h1 className="text-lg md:text-2xl font-bold text-gray-900 mb-3 leading-tight">
                    {selectedPost.title}
                  </h1>
                  
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar 
                      src={selectedPost.author.avatar} 
                      name={selectedPost.author.name}
                      size={40}
                      className="h-8 w-8 md:h-10 md:w-10"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs md:text-sm font-semibold text-gray-900">{selectedPost.author.name}</div>
                      <div className="text-xs text-gray-600">{selectedPost.author.credentials}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 md:gap-4 text-xs text-gray-600 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(selectedPost.publishedAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {selectedPost.readTime} min
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {formatViews(selectedPost.views)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-wrap">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLike}
                      className={`text-xs ${isLiked ? 'text-red-500' : 'text-gray-600'}`}
                    >
                      <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
                      {likes}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handlePlayPause}
                      className="text-xs text-gray-600"
                    >
                      {isPlaying ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
                      {isPlaying ? 'Pause' : 'Listen'}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowSummary(!showSummary)}
                      className="text-xs text-gray-600"
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Summary
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsBookmarked(!isBookmarked)}
                      className={`text-xs ${isBookmarked ? 'text-yellow-500' : 'text-gray-600'}`}
                    >
                      <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleShare}
                      className="text-xs text-gray-600"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="p-4 md:p-6">
                {hasAudioStarted && (
                  <Card className="mb-4 border-yellow-200 bg-yellow-50">
                    <CardContent className="p-3 md:p-4">
                      <div className="flex items-center gap-3">
                        <Headphones className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs md:text-sm font-medium text-gray-900">
                            {isPlaying ? 'Audio Playback Active' : 'Audio Paused'}
                          </p>
                          <p className="text-xs text-gray-600">
                            {isPlaying ? 'Article is being read aloud' : 'Click play to resume'}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Button size="sm" variant="outline" onClick={handlePlayPause} className="h-8 w-8 p-0">
                            {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleRestart} className="h-8 w-8 p-0">
                            <RotateCcw className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleStop} className="h-8 w-8 p-0 text-red-600">
                            <Square className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {showSummary && selectedPost && (
                  <Card className="mb-4 border-yellow-200 bg-yellow-50">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center text-base md:text-lg text-gray-900">
                        <FileText className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                        Article Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        {generateSummary().map((point, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <span className="text-yellow-600 font-medium text-xs md:text-sm">{index + 1}.</span>
                            <span className="text-gray-700 text-xs md:text-sm">{point}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {extractTableOfContents().length > 0 && (
                  <Card className="mb-4 border-gray-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm md:text-base font-semibold text-gray-900 flex items-center">
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
                          {extractTableOfContents().map((heading) => (
                            <button
                              key={heading.id}
                              onClick={() => scrollToSection(heading.id)}
                              className={`
                                w-full text-left text-xs md:text-sm py-1.5 px-2 rounded transition-colors
                                ${heading.level === 1 ? 'font-semibold' : ''}
                                ${heading.level === 2 ? 'pl-4 font-medium' : ''}
                                ${heading.level === 3 ? 'pl-6 text-xs' : ''}
                                text-gray-600 hover:bg-gray-100 hover:text-gray-900
                              `}
                            >
                              {heading.text}
                            </button>
                          ))}
                        </nav>
                      </CardContent>
                    )}
                  </Card>
                )}

                <div className="prose prose-sm md:prose-base max-w-none" ref={contentRef}>
                  <div className="aspect-video bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg mb-6 flex items-center justify-center">
                    <TrendingUp className="h-12 w-12 md:h-16 md:w-16 text-yellow-600" />
                  </div>
                  
                  {selectedPost && (
                    <div className="article-content">
                      {renderContent(selectedPost.content)}
                    </div>
                  )}
                </div>

                {selectedPost && (
                  <>
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2 mb-3">
                        <Tag className="h-4 w-4 text-gray-600" />
                        <span className="text-sm font-semibold text-gray-700">Tags:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedPost.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 p-4 md:p-6 bg-gray-50 rounded-lg">
                      <div className="flex items-start gap-3 md:gap-4">
                        <Avatar 
                          src={selectedPost.author.avatar} 
                          name={selectedPost.author.name}
                          size={64}
                          className="h-12 w-12 md:h-16 md:w-16 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2">About {selectedPost.author.name}</h3>
                          <p className="text-xs md:text-sm text-gray-600 mb-2">{selectedPost.author.bio}</p>
                          <p className="text-xs text-gray-500">{selectedPost.author.credentials}</p>
                        </div>
                      </div>
                    </div>

                    <Card className="mt-6 border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-transparent">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 md:p-3 bg-yellow-400 rounded-lg">
                              <Brain className="h-5 w-5 md:h-6 md:w-6 text-gray-900" />
                            </div>
                            <div>
                              <CardTitle className="text-base md:text-xl text-gray-900">Test Your Understanding</CardTitle>
                              <p className="text-xs md:text-sm text-gray-600 mt-1">Quick quiz based on this article</p>
                            </div>
                          </div>
                          {!showQuiz && (
                            <Button 
                              onClick={initializeQuiz}
                              className="bg-yellow-400 text-gray-900 hover:bg-yellow-500 text-xs md:text-sm"
                              size="sm"
                            >
                              Start Quiz
                            </Button>
                          )}
                        </div>
                      </CardHeader>
                      
                      {showQuiz && (
                        <CardContent className="space-y-4">
                          {!quizSubmitted ? (
                            <>
                              <div className="flex items-center justify-between p-3 md:p-4 bg-white rounded-lg border-2 border-yellow-200">
                                <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm">
                                  <span className="font-semibold text-gray-900">
                                    Questions: {quizQuestions.length}
                                  </span>
                                  <span className="text-gray-700">
                                    Answered: {Object.keys(quizAnswers).length}/{quizQuestions.length}
                                  </span>
                                </div>
                                <Button
                                  onClick={generateMoreQuestions}
                                  disabled={isGeneratingQuestions}
                                  variant="outline"
                                  size="sm"
                                  className="border-yellow-400 text-gray-900 hover:bg-yellow-50 text-xs"
                                >
                                  {isGeneratingQuestions ? (
                                    <>
                                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                      Generating...
                                    </>
                                  ) : (
                                    <>
                                      <Sparkles className="h-3 w-3 mr-1" />
                                      +5 More
                                    </>
                                  )}
                                </Button>
                              </div>

                              {quizQuestions.map((q, qIndex) => (
                                <div key={qIndex} className="bg-white p-3 md:p-4 rounded-lg border border-gray-200">
                                  <h4 className="font-semibold text-gray-900 mb-3 text-xs md:text-sm">
                                    {qIndex + 1}. {q.question}
                                  </h4>
                                  <div className="space-y-2">
                                    {q.options.map((option: string, oIndex: number) => (
                                      <button
                                        key={oIndex}
                                        onClick={() => handleQuizAnswer(qIndex, oIndex)}
                                        className={`w-full text-left p-3 rounded-lg border-2 transition-all text-xs md:text-sm ${
                                          quizAnswers[qIndex] === oIndex.toString()
                                            ? 'border-yellow-400 bg-yellow-50 text-gray-900 font-medium'
                                            : 'border-gray-200 hover:border-yellow-300 hover:bg-gray-50'
                                        }`}
                                      >
                                        <div className="flex items-center gap-2 md:gap-3">
                                          <div className={`w-4 h-4 md:w-5 md:h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                            quizAnswers[qIndex] === oIndex.toString()
                                              ? 'border-yellow-400 bg-yellow-400'
                                              : 'border-gray-300'
                                          }`}>
                                            {quizAnswers[qIndex] === oIndex.toString() && (
                                              <div className="w-2 h-2 rounded-full bg-gray-900" />
                                            )}
                                          </div>
                                          <span>{option}</span>
                                        </div>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              ))}
                              
                              <div className="flex flex-col items-center gap-3 pt-4">
                                {Object.keys(quizAnswers).length < quizQuestions.length && (
                                  <p className="text-xs md:text-sm text-gray-600">
                                    Please answer all {quizQuestions.length} questions to submit
                                  </p>
                                )}
                                <Button
                                  onClick={handleQuizSubmit}
                                  disabled={Object.keys(quizAnswers).length < quizQuestions.length}
                                  className="bg-yellow-400 text-gray-900 hover:bg-yellow-500 px-6 md:px-8 text-xs md:text-sm"
                                  size="sm"
                                >
                                  Submit Quiz ({Object.keys(quizAnswers).length}/{quizQuestions.length})
                                </Button>
                              </div>
                            </>
                          ) : (
                            <div className="text-center py-6 md:py-8">
                              <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-yellow-100 mb-4">
                                <Award className="h-8 w-8 md:h-10 md:w-10 text-yellow-600" />
                              </div>
                              <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-2">
                                Quiz Completed!
                              </h3>
                              <p className="text-base md:text-xl text-gray-700 mb-6">
                                You scored <span className="font-bold text-yellow-600">{getQuizScore()}</span> out of <span className="font-bold">{quizQuestions.length}</span>
                              </p>
                              
                              <div className="space-y-3 md:space-y-4 mt-6 md:mt-8 text-left">
                                {quizQuestions.map((q, qIndex) => {
                                  const userAnswer = parseInt(quizAnswers[qIndex] || '-1')
                                  const isCorrect = userAnswer === q.correctAnswer
                                  
                                  return (
                                    <div key={qIndex} className="bg-white p-3 md:p-4 rounded-lg border-2 border-gray-200">
                                      <div className="flex items-start gap-2 md:gap-3 mb-3">
                                        {isCorrect ? (
                                          <CheckCircle2 className="h-5 w-5 md:h-6 md:w-6 text-green-600 flex-shrink-0 mt-1" />
                                        ) : (
                                          <XCircle className="h-5 w-5 md:h-6 md:w-6 text-red-600 flex-shrink-0 mt-1" />
                                        )}
                                        <div className="flex-1 min-w-0">
                                          <h4 className="font-semibold text-gray-900 mb-3 text-xs md:text-sm">
                                            {qIndex + 1}. {q.question}
                                          </h4>
                                          <div className="space-y-2">
                                            {q.options.map((option: string, oIndex: number) => {
                                              const isUserAnswer = userAnswer === oIndex
                                              const isCorrectAnswer = q.correctAnswer === oIndex
                                              
                                              return (
                                                <div
                                                  key={oIndex}
                                                  className={`p-2 md:p-3 rounded-lg border-2 text-xs md:text-sm ${
                                                    isCorrectAnswer
                                                      ? 'border-green-500 bg-green-50'
                                                      : isUserAnswer
                                                      ? 'border-red-500 bg-red-50'
                                                      : 'border-gray-200'
                                                  }`}
                                                >
                                                  <div className="flex items-center gap-2">
                                                    {isCorrectAnswer && <CheckCircle2 className="h-3 w-3 md:h-4 md:w-4 text-green-600 flex-shrink-0" />}
                                                    {isUserAnswer && !isCorrectAnswer && <XCircle className="h-3 w-3 md:h-4 md:w-4 text-red-600 flex-shrink-0" />}
                                                    <span className={isCorrectAnswer ? 'font-medium text-green-900' : ''}>{option}</span>
                                                  </div>
                                                </div>
                                              )
                                            })}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                              
                              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mt-6 md:mt-8">
                                <Button
                                  onClick={generateMoreQuestions}
                                  disabled={isGeneratingQuestions}
                                  variant="outline"
                                  className="border-yellow-400 text-gray-900 hover:bg-yellow-50 text-xs md:text-sm"
                                  size="sm"
                                >
                                  {isGeneratingQuestions ? (
                                    <>
                                      <Loader2 className="h-3 w-3 md:h-4 md:w-4 mr-2 animate-spin" />
                                      Generating...
                                    </>
                                  ) : (
                                    <>
                                      <Sparkles className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                                      Generate 5 More
                                    </>
                                  )}
                                </Button>
                                <Button
                                  onClick={() => {
                                    setQuizSubmitted(false)
                                    setQuizAnswers({})
                                  }}
                                  variant="outline"
                                  className="border-yellow-400 text-gray-900 hover:bg-yellow-50 text-xs md:text-sm"
                                  size="sm"
                                >
                                  Retake Quiz
                                </Button>
                                <Button
                                  onClick={() => setShowQuiz(false)}
                                  className="bg-yellow-400 text-gray-900 hover:bg-yellow-500 text-xs md:text-sm"
                                  size="sm"
                                >
                                  Close Quiz
                                </Button>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      )}
                    </Card>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
