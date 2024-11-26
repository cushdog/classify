'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { PlusCircle, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { IBlogPostInsert } from '@/db/Blog/types';

const PASSWORD = process.env.NEXT_PUBLIC_BLOG_PASSWORD;

const BlogSubmissionForm = () => {
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordEntered, setPasswordEntered] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const router = useRouter();

  const handleAddTag = () => {
    if (currentTag && !tags.includes(currentTag)) {
      setTags([...tags, currentTag]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === PASSWORD) {
      setPasswordEntered(true);
      setPasswordError('');
    } else {
      setPasswordError('Incorrect password. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const title = formData.get('title')?.toString() || '';
    const excerpt = formData.get('excerpt')?.toString() || '';
    const content = formData.get('content')?.toString() || '';
    const authorName = formData.get('authorName')?.toString() || '';
    const authorRole = formData.get('authorRole')?.toString() || '';
    const readTime = formData.get('readTime')?.toString() || '0';

    const slug = title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '');

    const data: IBlogPostInsert = {
      title,
      excerpt,
      content,
      authorId: 'author-id', // Replace with actual user ID
      authorName,
      authorRole,
      readTime: parseInt(readTime, 10),
      tags,
      slug,
    };

    try {
      const res = await fetch('/api/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const newPost = await res.json();
        router.push(`/blog/${newPost.slug}`);
      } else {
        const errorData = await res.json();
        console.error('Failed to create post:', errorData.error);
      }
    } catch (error) {
      console.error('Failed to create post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!passwordEntered) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                Password Protected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Enter Password</Label>
                  <Input
                      id="password"
                      name="password"
                      type="password"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="Password"
                      required
                  />
                </div>
                {passwordError && <p className="text-red-600">{passwordError}</p>}
                <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                >
                  Submit
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        {/* Header Section */}
        <div
            className="w-full min-h-[250px] flex flex-col justify-end items-center text-white p-6"
            style={{
              background: 'linear-gradient(to bottom right, #3f51b5, #757de8)',
            }}
        >
          <h1 className="text-4xl font-bold mb-4">Create a New Blog Post</h1>
          <p className="text-lg text-center">
            Share your latest thoughts and ideas with the world.
          </p>
        </div>

        {/* Form Section */}
        <div className="p-6">
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center">
                Blog Post Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                      id="title"
                      name="title"
                      placeholder="Enter your blog post title"
                      required
                      className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                      id="excerpt"
                      name="excerpt"
                      placeholder="Write a brief summary of your post"
                      required
                      className="h-20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                      id="content"
                      name="content"
                      placeholder="Write your blog post content here"
                      required
                      className="h-64"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="authorName">Author Name</Label>
                    <Input
                        id="authorName"
                        name="authorName"
                        placeholder="Your name"
                        required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="authorRole">Role</Label>
                    <Input
                        id="authorRole"
                        name="authorRole"
                        placeholder="Your role"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="readTime">Read Time (in minutes)</Label>
                  <Input
                      id="readTime"
                      name="readTime"
                      type="number"
                      placeholder="5"
                      required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex gap-2">
                    <Input
                        value={currentTag}
                        onChange={(e) => setCurrentTag(e.target.value)}
                        placeholder="Add a tag"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                    />
                    <Button type="button" onClick={handleAddTag} variant="outline">
                      <PlusCircle className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag) => (
                        <Badge
                            key={tag}
                            variant="secondary"
                            className="flex items-center gap-1"
                        >
                          {tag}
                          <X
                              className="w-3 h-3 cursor-pointer"
                              onClick={() => handleRemoveTag(tag)}
                          />
                        </Badge>
                    ))}
                  </div>
                </div>

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                >
                  {isSubmitting ? 'Publishing...' : 'Publish Post'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
  );
};

export default BlogSubmissionForm;
