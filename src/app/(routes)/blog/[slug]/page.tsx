// app/blog/[slug]/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Heart, MessageCircle, Share2, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface IBlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  authorId: string;
  authorName: string;
  authorRole?: string;
  authorAvatar?: string;
  readTime: number;
  tags: string[];
  likes: number;
  comments: number;
  slug: string;
  createdAt: string; // or Date if you parse it
  updatedAt: string;
}

interface IBlogComment {
  id: number;
  postId: number;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  likes: number;
  createdAt: string; // or Date if you parse it
  updatedAt: string;
}

const BlogPostPage = () => {
  const router = useRouter();
  const { slug } = useParams() as { slug: string };
  const [post, setPost] = useState<IBlogPost | null>(null);
  const [comments, setComments] = useState<IBlogComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      try {
        const res = await fetch(`/api/blog/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setPost(data.post);
          setComments(data.comments);
        } else if (res.status === 404) {
          setPost(null);
        } else {
          console.error('Failed to fetch post:', res.statusText);
        }
      } catch (error) {
        console.error('Failed to fetch post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  const handleSubmitComment = async () => {
    if (!post || !newComment.trim()) return;

    try {
      const res = await fetch(`/api/blog/${slug}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment,
          authorId: 'Me', // Replace with actual user ID
          authorName: 'Current User', // Replace with actual user data
          authorAvatar: '/api/placeholder/32/32', // Replace with actual user avatar
        }),
      });

      if (res.ok) {
        const comment = await res.json();
        setComments([comment, ...comments]);
        setNewComment('');
      } else {
        console.error('Failed to submit comment:', res.statusText);
      }
    } catch (error) {
      console.error('Failed to submit comment:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 flex items-center justify-center">
        <div className="animate-pulse space-y-4 w-full max-w-4xl">
          <div className="h-8 bg-slate-200 rounded w-3/4" />
          <div className="h-4 bg-slate-200 rounded w-1/2" />
          <div className="h-64 bg-slate-200 rounded" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-700">Post Not Found</h2>
          <Button 
            onClick={() => router.push('/blog')}
            className="mt-4 bg-gradient-to-r from-purple-600 to-blue-600"
          >
            Back to Blog
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Button 
          onClick={() => router.push('/blog')}
          variant="ghost"
          className="mb-8"
        >
          ← Back to Blog
        </Button>

        <article className="bg-white rounded-lg shadow-lg p-8">
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={post.authorAvatar ?? '/api/placeholder/32/32'} />
                  <AvatarFallback>{post.authorName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{post.authorName}</p>
                  <p className="text-sm text-slate-500">{post.authorRole}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm text-slate-500">
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {post.readTime} min read
                </span>
                <span>
                  {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags?.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </header>

          <div
            className="prose max-w-none mb-8"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <footer className="flex items-center justify-between pt-6 border-t">
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                <Heart className="w-4 h-4" />
                <span>{post.likes}</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                <MessageCircle className="w-4 h-4" />
                <span>{comments.length}</span>
              </Button>
            </div>
            <Button variant="ghost" size="sm">
              <Share2 className="w-4 h-4" />
            </Button>
          </footer>
        </article>

        <section className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Comments</h2>
          
          <div className="mb-6">
            <Textarea
              placeholder="Share your thoughts..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="mb-2"
            />
            <Button 
              onClick={handleSubmitComment}
              className="bg-gradient-to-r from-purple-600 to-blue-600"
            >
              <Send className="w-4 h-4 mr-2" />
              Post Comment
            </Button>
          </div>

          <div className="space-y-6">
            {comments.map((comment) => (
              <Card key={comment.id}>
                <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                  <Avatar>
                    <AvatarImage src={comment.authorAvatar ?? '/api/placeholder/32/32'} />
                    <AvatarFallback>{comment.authorName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-sm font-medium">
                      {comment.authorName}
                    </CardTitle>
                    <p className="text-xs text-slate-500">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700">{comment.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default BlogPostPage;
