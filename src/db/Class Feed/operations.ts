import { db } from "../db";
import { IPost, IPostInsert, posts } from "./schema";
import { IReply, IReplyInsert, replies } from "./schema";
import { eq } from "drizzle-orm";

export const getPostById = async (id: number): Promise<IPost | null> => {
    const res = await db.select().from(posts).where(eq(posts.id, id));
    return res?.[0] ?? null;
  };
  
  export const insertPost = async (data: IPostInsert): Promise<IPost | null> => {
    const res = await db
      .insert(posts)
      .values(data)
      .returning();
    return res?.[0] ?? null;
  };
  
  export const updatePostById = async (
    id: number,
    diff: Partial<IPost>
  ): Promise<IPost | null> => {
    const result = await db
      .update(posts)
      .set(diff)
      .where(eq(posts.id, id))
      .returning();
    return result?.[0] ?? null;
  };
  
  export const deletePostById = async (id: number): Promise<IPost | null> => {
    const result = await db
      .delete(posts)
      .where(eq(posts.id, id))
      .returning();
    return result?.[0] ?? null;
  };
  
  export const getAllPosts = async (): Promise<IPost[]> => {
    return db.select().from(posts);
  };
  
  // Reply operations
  export const getReplyById = async (id: number): Promise<IReply | null> => {
    const res = await db.select().from(replies).where(eq(replies.id, id));
    return res?.[0] ?? null;
  };
  
  export const insertReply = async (data: IReplyInsert): Promise<IReply | null> => {
    const res = await db
      .insert(replies)
      .values(data)
      .returning();
    return res?.[0] ?? null;
  };
  
  export const updateReplyById = async (
    id: number,
    diff: Partial<IReply>
  ): Promise<IReply | null> => {
    const result = await db
      .update(replies)
      .set(diff)
      .where(eq(replies.id, id))
      .returning();
    return result?.[0] ?? null;
  };
  
  export const deleteReplyById = async (id: number): Promise<IReply | null> => {
    const result = await db
      .delete(replies)
      .where(eq(replies.id, id))
      .returning();
    return result?.[0] ?? null;
  };
  
  export const getRepliesByPostId = async (postId: number): Promise<IReply[]> => {
    return db.select().from(replies).where(eq(replies.postId, postId));
  };