// app/api/reviews/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {
  insertClassReview,
  getClassReviewsByCourseWithAverages,
} from '@/db/Supabase Reviews/operations';
import { IClassReviewInsert } from '@/db/Supabase Reviews/types';

// Handle GET requests (fetch reviews with averages)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const subject = searchParams.get('subject');
  const courseNumber = searchParams.get('courseNumber');
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const offset = parseInt(searchParams.get('offset') || '0', 10);

  if (!subject || !courseNumber) {
    return NextResponse.json(
      { error: 'Subject and course number are required' },
      { status: 400 }
    );
  }

  try {
    const { reviews, averages } = await getClassReviewsByCourseWithAverages(
      subject,
      courseNumber,
      limit,
      offset
    );

    return NextResponse.json({ reviews, averages });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle POST requests (insert a new review)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const reviewData: IClassReviewInsert = body;

    // Validate required fields
    if (!reviewData.subject || !reviewData.courseNumber) {
      return NextResponse.json(
        { error: 'Subject and course number are required' },
        { status: 400 }
      );
    }

    const newReview = await insertClassReview(reviewData);

    if (newReview) {
      return NextResponse.json(newReview, { status: 201 });
    } else {
      return NextResponse.json(
        { error: 'Failed to insert review' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Review submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
