// app/api/blog/[slug]/comments/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getBlogPostBySlug, insertComment } from '@/db/Blog/operations';
import { IBlogCommentInsert } from '@/db/Blog/types';

export async function POST(
    request: NextRequest,
    { params }: { params: { slug: string } }
) {
  const { slug } = params;
  const { content, authorId, authorName, authorAvatar } = await request.json();

  if (!content || !authorId || !authorName) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    // Fetch the post by slug to get the postId
    const post = await getBlogPostBySlug(slug);

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const commentData: IBlogCommentInsert = {
      postId: post.id,
      content,
      authorId,
      authorName,
      authorAvatar,
    };

    const comment = await insertComment(commentData);
    return NextResponse.json(comment);
  } catch (error) {
    console.error('Error inserting comment:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
