// app/api/blog/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getAllBlogPosts, insertBlogPost } from '@/db/Blog/operations';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const {
      title,
      excerpt,
      content,
      authorId,
      authorName,
      authorRole,
      readTime,
      tags,
      slug,
    } = data;

    if (
      !title ||
      !excerpt ||
      !content ||
      !authorId ||
      !authorName ||
      !readTime ||
      !tags ||
      !slug
    ) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const postData = {
      title,
      excerpt,
      content,
      authorId,
      authorName,
      authorRole,
      readTime: parseInt(readTime, 10),
      tags,
      slug,
    };

    const newPost = await insertBlogPost(postData);

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('Error inserting blog post:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    const { posts, total } = await getAllBlogPosts(limit, offset);

    return NextResponse.json({ posts, total });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
