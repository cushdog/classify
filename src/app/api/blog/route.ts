import { NextResponse } from 'next/server';
import { 
  getBlogPostById, 
  getAllBlogPosts, 
  searchBlogPosts 
} from '@/db/Blog/operations';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const query = searchParams.get('query');
  const page = parseInt(searchParams.get('page') ?? '1');
  const limit = parseInt(searchParams.get('limit') ?? '10');
  const offset = (page - 1) * limit;

  try {
    if (id) {
      const post = await getBlogPostById(parseInt(id));
      return NextResponse.json(post);
    }
    
    if (query) {
      const posts = await searchBlogPosts(query, limit);
      return NextResponse.json(posts);
    }

    const { posts, total } = await getAllBlogPosts(limit, offset);
    return NextResponse.json({ posts, total });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}