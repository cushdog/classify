'use server';

import { eq } from 'drizzle-orm';
import { db } from '../db';
import { IReview, IReviewInsert, reviews } from './schema';

export const getReviewById = async (id: number): Promise<IReview | null> => {
  const res = await db.select().from(reviews).where(eq(reviews.id, id));
  return res?.[0] ?? null;
};

export const insertReview = async (data: IReviewInsert): Promise<IReview | null> => {
  const res = await db
    .insert(reviews)
    .values(data)
    .returning();

  return res?.[0] ?? null;
};

export const updateReviewById = async (
  id: number,
  diff: Partial<IReview>
): Promise<IReview | null> => {
  const result = await db
    .update(reviews)
    .set(diff)
    .where(eq(reviews.id, id))
    .returning();

  return result?.[0] ?? null;
};

export const deleteReviewById = async (id: number): Promise<IReview | null> => {
  const result = await db
    .delete(reviews)
    .where(eq(reviews.id, id))
    .returning();

  return result?.[0] ?? null;
};

export const getAllReviews = async (): Promise<IReview[]> => {
  return db.select().from(reviews);
};