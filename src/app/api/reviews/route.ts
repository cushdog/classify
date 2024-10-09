'use server';

import { insertReview } from '@/db/Reviews/operations';
import { IReviewInsert } from '@/db/Reviews/schema';

export async function submitReview(data: IReviewInsert) {
  try {
    const result = await insertReview(data);
    return { success: true, review: result };
  } catch (error) {
    console.error('Error submitting review:', error);
    return { success: false, error: 'Failed to submit review' };
  }
}