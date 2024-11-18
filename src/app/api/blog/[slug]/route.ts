// app/api/blog/[slug]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getBlogPostBySlug, getCommentsByPostId } from '@/db/Blog/operations';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  try {
    const post = await getBlogPostBySlug(slug);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const comments = await getCommentsByPostId(post.id);

    return NextResponse.json({ post, comments });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
