// db/operations.ts

import { supabase } from '@/lib/Library Functions and Clients/supabaseClient';
import { IBlogPost, IBlogPostInsert, IBlogComment, IBlogCommentInsert } from './schema';
import snakecaseKeys from 'snakecase-keys';
import camelcaseKeys from 'camelcase-keys';

// Blog Post Operations
/* eslint-disable  @typescript-eslint/no-explicit-any */
function mapArrayToCamelCase<T>(data: any[]): T[] {
  return data.map(item => camelcaseKeys(item));
}

export const getAllBlogPosts = async (
    limit: number = 10,
    offset: number = 0
): Promise<{ posts: IBlogPost[]; total: number }> => {
  const { data: posts, error, count } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

  if (error) {
    console.error('Error fetching all blog posts:', error);
    return { posts: [], total: 0 };
  }

  const camelCasePosts = mapArrayToCamelCase<IBlogPost>(posts || []);

  return { posts: camelCasePosts, total: count || 0 };
};

export const insertBlogPost = async (
    data: IBlogPostInsert
): Promise<IBlogPost | null> => {
  // Map camelCase properties to snake_case
  const mappedData = snakecaseKeys(data);

  const { data: insertedData, error } = await supabase
      .from('blog_posts')
      .insert([mappedData])
      .select('*')
      .single();

  if (error) {
    console.error('Error inserting blog post:', error);
    return null;
  }

  // Convert returned data to camelCase
  const camelCaseData = camelcaseKeys(insertedData);

  return camelCaseData as IBlogPost;
};

export const insertComment = async (
    data: IBlogCommentInsert
): Promise<IBlogComment | null> => {
  // Map camelCase properties to snake_case
  const mappedData = snakecaseKeys(data);

  const { data: insertedData, error } = await supabase
      .from('blog_comments')
      .insert([mappedData])
      .select('*')
      .single();

  if (error) {
    console.error('Error inserting comment:', error);
    return null;
  }

  // Convert returned data to camelCase
  const camelCaseData = camelcaseKeys(insertedData);

  return camelCaseData as IBlogComment;
};

// Adjust other operations similarly (getBlogPostBySlug, getCommentsByPostId, etc.)

// Example for getBlogPostBySlug

export const getBlogPostBySlug = async (slug: string): Promise<IBlogPost | null> => {
  const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single();

  if (error) {
    console.error('Error fetching blog post by slug:', error);
    return null;
  }

  const camelCaseData = camelcaseKeys(data);

  return camelCaseData as IBlogPost;
};

// Similarly adjust getCommentsByPostId

export const getCommentsByPostId = async (
    postId: number,
    limit: number = 10,
    offset: number = 0
): Promise<IBlogComment[]> => {
  const { data, error } = await supabase
      .from('blog_comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

  if (error) {
    console.error('Error fetching comments by post id:', error);
    return [];
  }

  const camelCaseData = camelcaseKeys(data);

  return camelCaseData as IBlogComment[];
};
