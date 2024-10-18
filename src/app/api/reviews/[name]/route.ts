// app/api/reviews/[name]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/db';
import { reviews } from '@/db/Reviews/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  try {
    const name = decodeURIComponent(params.name);
    console.log("NAME: ", name);
    const classReviews = await db.select().from(reviews).where(eq(reviews.name, name));
    console.log("REVIEWS: ", classReviews);
    return NextResponse.json({ success: true, reviews: classReviews }, { status: 200 });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch reviews' }, { status: 500 });
  }
}