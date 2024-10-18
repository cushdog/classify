import { NextResponse } from 'next/server';
import { getWikiByClassName, insertWiki, updateWikiByClassName } from '@/db/Course Wikis/operations';

// GET request: Fetch class wiki information
export async function GET(req: Request, { params }: { params: { className: string } }) {
  const { className } = params;
  const wiki = await getWikiByClassName(className);

  if (!wiki) {
    return NextResponse.json({ error: 'Class wiki not found' }, { status: 404 });
  }

  return NextResponse.json(wiki);
}

// POST request: Add or update class wiki information
export async function POST(req: Request, { params }: { params: { className: string } }) {
  const { className } = params;
  const data = await req.json();

  // Check if the class wiki exists
  const existingWiki = await getWikiByClassName(className);

  if (existingWiki) {
    // Merge existing data with new data
    const updatedData = {
      ...existingWiki,
      ...data,
      className, // Ensure className remains the same
    };

    const updatedWiki = await updateWikiByClassName(className, updatedData);
    return NextResponse.json(updatedWiki);
  } else {
    // If it doesn't exist, insert new class wiki
    const newWikiData = {
      className,
      ...data,
    };
    const newWiki = await insertWiki(newWikiData);
    return NextResponse.json(newWiki);
  }
}
