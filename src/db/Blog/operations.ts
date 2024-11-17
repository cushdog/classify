// db/operations.ts
import { db } from "../db";
import { eq, desc, ilike, sql } from "drizzle-orm";
import { IBlogPost, IBlogPostInsert, blogPosts } from "./schema";
import { IBlogComment, IBlogCommentInsert, blogComments } from "./schema";

// Blog Post Operations
export const getBlogPostById = async (id: number): Promise<IBlogPost | null> => {
  const res = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
  return res?.[0] ?? null;
};

export const getBlogPostBySlug = async (slug: string): Promise<IBlogPost | null> => {
  const res = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
  return res?.[0] ?? null;
};

export const getAllBlogPosts = async (
  limit: number = 10,
  offset: number = 0
): Promise<{ posts: IBlogPost[]; total: number }> => {
  const posts = await db
    .select()
    .from(blogPosts)
    .orderBy(desc(blogPosts.createdAt))
    .limit(limit)
    .offset(offset);

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(blogPosts);

  return { posts, total: count };
};

export const searchBlogPosts = async (
  query: string,
  limit: number = 10
): Promise<IBlogPost[]> => {
  return db
    .select()
    .from(blogPosts)
    .where(ilike(blogPosts.title, `%${query}%`))
    .orderBy(desc(blogPosts.createdAt))
    .limit(limit);
};

export const insertBlogPost = async (
  data: IBlogPostInsert
): Promise<IBlogPost | null> => {
  const res = await db.insert(blogPosts).values(data).returning();
  return res?.[0] ?? null;
};

export const updateBlogPost = async (
  id: number,
  data: Partial<IBlogPost>
): Promise<IBlogPost | null> => {
  const res = await db
    .update(blogPosts)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(blogPosts.id, id))
    .returning();
  return res?.[0] ?? null;
};

export const deleteBlogPost = async (id: number): Promise<IBlogPost | null> => {
  const res = await db
    .delete(blogPosts)
    .where(eq(blogPosts.id, id))
    .returning();
  return res?.[0] ?? null;
};

// Blog Comment Operations
export const getCommentsByPostId = async (
  postId: number,
  limit: number = 10,
  offset: number = 0
): Promise<IBlogComment[]> => {
  return db
    .select()
    .from(blogComments)
    .where(eq(blogComments.postId, postId))
    .orderBy(desc(blogComments.createdAt))
    .limit(limit)
    .offset(offset);
};

export const insertComment = async (
  data: IBlogCommentInsert
): Promise<IBlogComment | null> => {
  const res = await db.insert(blogComments).values(data).returning();
  return res?.[0] ?? null;
};

export const deleteComment = async (id: number): Promise<IBlogComment | null> => {
  const res = await db
    .delete(blogComments)
    .where(eq(blogComments.id, id))
    .returning();
  return res?.[0] ?? null;
};