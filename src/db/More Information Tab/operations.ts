// db/moreInfoOperations.ts
import { db } from "../db";
import { eq, desc, sql } from "drizzle-orm";
import { moreInfoPosts, IMoreInfoPost, IMoreInfoPostInsert } from "./schema";

// More Information Post Operations
export const getMoreInfoPostsByCourseId = async (
  courseId: string,
  limit: number = 10,
  offset: number = 0
): Promise<{ posts: IMoreInfoPost[]; total: number }> => {
  const posts = await db
    .select()
    .from(moreInfoPosts)
    .where(eq(moreInfoPosts.courseId, courseId))
    .orderBy(desc(moreInfoPosts.datePosted))
    .limit(limit)
    .offset(offset);

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(moreInfoPosts)
    .where(eq(moreInfoPosts.courseId, courseId));

  return { posts, total: count };
};

export const insertMoreInfoPost = async (
  data: IMoreInfoPostInsert
): Promise<IMoreInfoPost | null> => {
  const res = await db.insert(moreInfoPosts).values(data).returning();
  return res?.[0] ?? null;
};

export const updateMoreInfoPost = async (
  id: number,
  data: Partial<IMoreInfoPost>
): Promise<IMoreInfoPost | null> => {
  const res = await db
    .update(moreInfoPosts)
    .set({ ...data, datePosted: new Date() })
    .where(eq(moreInfoPosts.id, id))
    .returning();
  return res?.[0] ?? null;
};

export const deleteMoreInfoPost = async (id: number): Promise<IMoreInfoPost | null> => {
  const res = await db.delete(moreInfoPosts).where(eq(moreInfoPosts.id, id)).returning();
  return res?.[0] ?? null;
};
