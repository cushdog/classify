import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/utils/auth';  // Adjust this import path as necessary
import { insertReview } from '@/db/Reviews/operations';
import { IReviewInsert } from '@/db/Reviews/schema';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const data: Omit<IReviewInsert, 'email'> = await req.json();
    
    const reviewData: IReviewInsert = {
      ...data,
      email: session.user.email
    };

    const result = await insertReview(reviewData);
    return NextResponse.json({ success: true, review: result }, { status: 200 });
  } catch (error) {
    console.error('Error submitting review:', error);
    return NextResponse.json({ success: false, error: 'Failed to submit review' }, { status: 500 });
  }
}