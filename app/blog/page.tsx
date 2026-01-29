"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Search,
  Calendar,
  Clock,
  ArrowRight,
  BookOpen,
  TrendingUp,
  Star,
  Filter,
  ChevronLeft,
  ChevronRight,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MOCK_BLOG_POSTS, BLOG_CATEGORIES, type BlogPost } from "@/lib/blog-data";
import { cn } from "@/lib/utils";
import { useMenu } from "@/contexts/MenuContext";

const POSTS_PER_PAGE = 10;

type BlogCardProps = {
  post: BlogPost;
  className?: string;
};

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredPosts, setFilteredPosts] = useState(MOCK_BLOG_POSTS);
  const [currentPage, setCurrentPage] = useState(1);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [email, setEmail] = useState("");
  const [sortBy, setSortBy] = useState<"latest" | "mostLiked" | "mostViewed">(
    "latest",
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterPosts(query, selectedCategory);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    filterPosts(searchQuery, category);
  };

  const filterPosts = (query: string, category: string) => {
    let filtered = MOCK_BLOG_POSTS;

    if (category !== "All") {
      filtered = filtered.filter((post) => post.category === category);
    }

    if (query) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(query.toLowerCase()) ||
          post.tags.some((tag) =>
            tag.toLowerCase().includes(query.toLowerCase()),
          ),
      );
    }

    setFilteredPosts(filtered);
    setCurrentPage(1);
  };

  const handleNextFeatured = () => {
    const featuredPosts = filteredPosts.filter((post) => post.featured);
    setFeaturedIndex((prev) =>
      prev + 2 >= featuredPosts.length ? 0 : prev + 2,
    );
  };

  const handlePrevFeatured = () => {
    const featuredPosts = filteredPosts.filter((post) => post.featured);
    setFeaturedIndex((prev) =>
      prev - 2 < 0 ? Math.max(0, featuredPosts.length - 2) : prev - 2,
    );
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Subscribing email:", email);
    setEmail("");
  };

  const featuredPosts = filteredPosts.filter((post) => post.featured);
  let regularPosts = filteredPosts.filter((post) => !post.featured);

  regularPosts = [...regularPosts].sort((a, b) => {
    switch (sortBy) {
      case "mostLiked":
        return b.likes - a.likes;
      case "mostViewed":
        return b.views - a.views;
      case "latest":
      default:
        return (
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
    }
  });

  const totalPages = Math.ceil(regularPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const paginatedPosts = regularPosts.slice(
    startIndex,
    startIndex + POSTS_PER_PAGE,
  );

  const displayedFeaturedPosts = featuredPosts.slice(
    featuredIndex,
    featuredIndex + 2,
  );

  const categoryPanelPosts =
    selectedCategory === "All"
      ? filteredPosts
      : filteredPosts.filter((post) => post.category === selectedCategory);

  const sidebarCategoryPosts = categoryPanelPosts.slice(0, 5);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatViews = (views: number) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}k`;
    }
    return views.toString();
  };

  const BlogCard = ({ post, className }: BlogCardProps) => (
    <Link
      href={`/blog/${post.id}`}
      className={cn("group", className)}
    >
      <article className="bg-card rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-border">
        <div className="aspect-[16/9] bg-gradient-to-br from-yellow-100 to-orange-100 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3">
            <Badge className="bg-yellow-400 text-gray-900 mb-2 text-xs">
              {post.category}
            </Badge>
            <h3 className="text-lg font-bold text-foreground line-clamp-2 group-hover:text-yellow-400 transition-colors">
              {post.title}
            </h3>
          </div>
        </div>

        <div className="p-4">
          <p className="text-muted-foreground mb-3 line-clamp-2 text-sm">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-3">
              <span>{post.author.name}</span>
              <span>•</span>
              <span>{post.readTime} min</span>
              <span>•</span>
              <span>{formatViews(post.views)} views</span>
            </div>
            <ArrowRight className="h-4 w-4 text-yellow-600 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </article>
    </Link>
  );

  const { setShowSecondRow } = useMenu();
  useEffect(() => {
    setShowSecondRow(false);

    return () => setShowSecondRow(true);
  }, []);

  return (
    <div className="space-y-4 relative">
      {/* Hero Section */}
      <section className=" border-border/60 pt-10 space-y-2">
        <h1 className="text-2xl md:text-4xl font-semibold text-foreground">
          News & Study Tips
        </h1>

        <div className="max-w-xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search articles, topics, or authors..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 pr-4 py-3 text-base bg-card border border-border rounded-lg h-6 text-sm focus:ring-2 focus:ring-primary/70"
          />
        </div>

        {/* Category Filter */}
        <div className="sticky top-0 z-40 backdrop-blur">
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 ">
            <div className="h-9 rounded-lg border border-white/60 dark:border-white/10 bg-white/70 dark:bg-slate-900/40 supports-[backdrop-filter]:bg-white/40 supports-[backdrop-filter]:dark:bg-slate-900/30 backdrop-blur-xl flex items-center justify-between gap-4">
              <div className="flex items-center space-x-1 overflow-x-auto scrollbar-hide">
                {BLOG_CATEGORIES.map((category) => (
                  <Button
                    key={category}
                    variant={
                      selectedCategory === category ? "default" : "ghost"
                    }
                    size="sm"
                    onClick={() => handleCategoryFilter(category)}
                    className={`whitespace-nowrap rounded-lg px-2 text-xs ${
                      selectedCategory === category
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    {category}
                  </Button>
                ))}
              </div>
              <div className="hidden md:flex items-center text-sm text-muted-foreground whitespace-nowrap">
                <Filter className="h-4 w-4 mr-2" />
                {filteredPosts.length} articles
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-autosm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Main Content */}
          <div className="flex-1">
            <Accordion type="multiple" defaultValue={["featured", "latest"]} className="space-y-2">
              {featuredPosts.length > 0 && (
                <AccordionItem value="featured" className="rounded-2xl border-none p-0">
                  <AccordionTrigger className="font-semibold text-foreground">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      Featured Articles
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm text-muted-foreground">
                        Curated picks from mentors & toppers
                      </p>
                      {featuredPosts.length > 2 && (
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={handlePrevFeatured}
                            variant="outline"
                            size="sm"
                            aria-label="Previous featured"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={handleNextFeatured}
                            variant="outline"
                            size="sm"
                            aria-label="Next featured"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {displayedFeaturedPosts.map((post) => (
                        <BlogCard key={post.id} post={post} />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              <AccordionItem value="latest" className="rounded-2xl border-none">
                <AccordionTrigger className="font-semibold text-foreground">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-yellow-500" />
                    Latest Articles
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  {paginatedPosts.length > 0 && (
                    <>
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                          <span className="text-sm text-muted-foreground">
                            {regularPosts.length} posts
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground hidden sm:block">
                            Sort by:
                          </span>
                          <div className="flex gap-1">
                            <Button
                              variant={sortBy === "latest" ? "default" : "ghost"}
                              size="sm"
                              onClick={() => setSortBy("latest")}
                              className={
                                sortBy === "latest"
                                  ? "bg-yellow-400 text-gray-900 hover:bg-yellow-500"
                                  : "text-muted-foreground"
                              }
                            >
                              Latest
                            </Button>
                            <Button
                              variant={
                                sortBy === "mostViewed" ? "default" : "ghost"
                              }
                              size="sm"
                              onClick={() => setSortBy("mostViewed")}
                              className={
                                sortBy === "mostViewed"
                                  ? "bg-yellow-400 text-gray-900 hover:bg-yellow-500"
                                  : "text-muted-foreground"
                              }
                            >
                              Most Viewed
                            </Button>
                            <Button
                              variant={sortBy === "mostLiked" ? "default" : "ghost"}
                              size="sm"
                              onClick={() => setSortBy("mostLiked")}
                              className={
                                sortBy === "mostLiked"
                                  ? "bg-yellow-400 text-gray-900 hover:bg-yellow-500"
                                  : "text-muted-foreground"
                              }
                            >
                              Most Liked
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {paginatedPosts.map((post) => (
                          <Link
                            key={post.id}
                            href={`/blog/${post.id}`}
                            className="group"
                          >
                            <article className="bg-card rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-border">
                              <div className="flex">
                                <div className="w-32 h-24 bg-gradient-to-br from-yellow-100 to-orange-100 flex-shrink-0 relative">
                                  <div className="absolute top-2 left-2">
                                    <Badge
                                      variant="secondary"
                                      className="bg-background/90 text-foreground text-xs"
                                    >
                                      {post.category}
                                    </Badge>
                                  </div>
                                </div>

                                <div className="p-4 flex-1">
                                  <h3 className="text-base font-bold text-foreground mb-2 line-clamp-2 group-hover:text-yellow-600 transition-colors">
                                    {post.title}
                                  </h3>

                                  <p className="text-muted-foreground mb-3 line-clamp-2 text-sm">
                                    {post.excerpt}
                                  </p>

                                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <div className="flex items-center space-x-2">
                                      <span>{post.author.name}</span>
                                      <span>•</span>
                                      <span>{post.readTime} min</span>
                                      <span>•</span>
                                      <span>{formatViews(post.views)} views</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </article>
                          </Link>
                        ))}
                      </div>

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="flex items-center justify-center space-x-2 mt-8">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setCurrentPage((prev) => Math.max(prev - 1, 1))
                            }
                            disabled={currentPage === 1}
                          >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Previous
                          </Button>

                          <div className="flex items-center space-x-1">
                            {Array.from(
                              { length: Math.min(totalPages, 5) },
                              (_, i) => i + 1,
                            ).map((page) => (
                              <Button
                                key={page}
                                variant={
                                  currentPage === page ? "default" : "outline"
                                }
                                size="sm"
                                onClick={() => setCurrentPage(page)}
                                className={
                                  currentPage === page
                                    ? "bg-yellow-400 text-gray-900 hover:bg-yellow-500"
                                    : ""
                                }
                              >
                                {page}
                              </Button>
                            ))}
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setCurrentPage((prev) =>
                                Math.min(prev + 1, totalPages),
                              )
                            }
                            disabled={currentPage === totalPages}
                          >
                            Next
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                      )}
                    </>
                  )}

                  {filteredPosts.length === 0 && (
                    <div className="text-center py-12">
                      <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        No articles found
                      </h3>
                      <p className="text-muted-foreground">
                        Try adjusting your search or filter criteria
                      </p>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 space-y-6">
            {/* Category-Specific Picks */}
            <div className="space-y-3">
              <div className="flex items-center text-foreground font-semibold">
                <TrendingUp className="h-5 w-5 mr-2" />
                {selectedCategory === "All"
                  ? "Trending Picks"
                  : `${selectedCategory} Picks`}
              </div>
              <div className="space-y-4">
                {sidebarCategoryPosts.length > 0 ? (
                  sidebarCategoryPosts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground py-4 text-center">
                    No posts found for this category yet.
                  </div>
                )}
              </div>
            </div>

            {/* Newsletter Subscription */}
            <Card className="bg-card text-foreground">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  Stay Updated
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 text-sm">
                  Get the latest study tips and strategies delivered to your
                  inbox weekly.
                </p>
                <form onSubmit={handleSubscribe} className="space-y-3">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-background text-foreground border-0"
                    required
                  />
                  <Button
                    type="submit"
                    className="w-full bg-yellow-400 text-gray-900 hover:bg-yellow-500 font-semibold"
                  >
                    Subscribe
                  </Button>
                </form>
                <p className="text-xs text-muted-foreground mt-2">
                  No spam. Unsubscribe anytime.
                </p>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {BLOG_CATEGORIES.slice(1).map((category) => (
                  <Button
                    key={category}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCategoryFilter(category)}
                    className="w-full justify-start text-left text-muted-foreground hover:text-foreground hover:bg-accent"
                  >
                    {category}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
