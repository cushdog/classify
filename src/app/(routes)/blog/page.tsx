'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookOpen, Clock, Heart, MessageCircle, Share2 } from 'lucide-react';
import { getAllBlogPosts } from '@/db/Blog/operations';
import { IBlogPost } from '@/db/Blog/schema';

const BlogLayout = () => {
  const [posts, setPosts] = useState<IBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { posts } = await getAllBlogPosts(10, 0);
        setPosts(posts);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-full h-48 bg-slate-200 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 flex flex-col items-center justify-center">
        <div className="text-center space-y-4">
          <BookOpen className="w-16 h-16 text-slate-400 mx-auto" />
          <h2 className="text-2xl font-bold text-slate-700">No Posts Yet</h2>
          <p className="text-slate-500">Be the first one to share your thoughts!</p>
          <Button 
            onClick={() => router.push('/blog/new')}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            Create First Post
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            My Tech Blog
          </h1>
          <p className="text-slate-600 text-lg">
            Exploring the frontiers of technology and development
          </p>
          <Button 
            onClick={() => router.push('/blog/new')}
            className="mt-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            Create New Post
          </Button>
        </header>

        <div className="grid gap-6">
          {posts.map((post) => (
            <Card 
              key={post.id} 
              className="group hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
              onClick={() => router.push(`/blog/${post.slug}`)}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={post.authorAvatar ?? '/api/placeholder/32/32'} />
                      <AvatarFallback>{post.authorName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{post.authorName}</p>
                      <p className="text-xs text-slate-500">{post.authorRole}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-slate-500">
                    <Clock className="w-4 h-4" />
                    <span>{post.readTime} min read</span>
                  </div>
                </div>
                <CardTitle className="text-2xl group-hover:text-purple-600 transition-colors duration-200">
                  {post.title}
                </CardTitle>
                <CardDescription className="mt-2 line-clamp-2">
                  {post.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {post.tags?.map((tag) => (
                    <Badge key={tag} variant="secondary" className="hover:bg-slate-200 transition-colors">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <div className="flex space-x-4">
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <Heart className="w-4 h-4" />
                    <span>{post.likes}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.comments}</span>
                  </Button>
                </div>
                <Button variant="ghost" size="sm">
                  <Share2 className="w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogLayout;