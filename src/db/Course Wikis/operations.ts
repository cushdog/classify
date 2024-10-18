'use server';

import { eq } from 'drizzle-orm';
import { db } from '../db';
import { ICourseWiki, ICourseWikiInsert, courseWikis } from './schema';

export const getWikiByClassName = async (className: string): Promise<ICourseWiki | null> => {
  const res = await db.select().from(courseWikis).where(eq(courseWikis.className, className));
  return res?.[0] ?? null;
};

export const insertWiki = async (data: ICourseWikiInsert): Promise<ICourseWiki | null> => {
  const res = await db
    .insert(courseWikis)
    .values(data)
    .returning();

  return res?.[0] ?? null;
};

export const updateWikiByClassName = async (
  className: string,
  diff: Partial<ICourseWiki>
): Promise<ICourseWiki | null> => {
  const result = await db
    .update(courseWikis)
    .set(diff)
    .where(eq(courseWikis.className, className))
    .returning();

  return result?.[0] ?? null;
};

export const deleteWikiByClassName = async (className: string): Promise<ICourseWiki | null> => {
  const result = await db
    .delete(courseWikis)
    .where(eq(courseWikis.className, className))
    .returning();

  return result?.[0] ?? null;
};

export const getAllWikis = async (): Promise<ICourseWiki[]> => {
  return db.select().from(courseWikis);
};