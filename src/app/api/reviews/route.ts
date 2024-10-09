import { NextRequest, NextResponse } from 'next/server';
import { insertReview } from '@/db/Reviews/operations';
import { IReviewInsert } from '@/db/Reviews/schema';

export async function POST(req: NextRequest) {
  try {
    const data: IReviewInsert = await req.json();
    const result = await insertReview(data);
    return NextResponse.json({ success: true, review: result }, { status: 200 });
  } catch (error) {
    console.error('Error submitting review:', error);
    return NextResponse.json({ success: false, error: 'Failed to submit review' }, { status: 500 });
  }
}
