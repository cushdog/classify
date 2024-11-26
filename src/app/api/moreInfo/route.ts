// app/api/moreInfo/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getMoreInfoPostsByCourseId, insertMoreInfoPost } from "@/db/More Information Tab/operations";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const courseId = searchParams.get("courseId");
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const offset = parseInt(searchParams.get("offset") || "0", 10);

  if (!courseId) {
    return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
  }

  try {
    const { posts, total } = await getMoreInfoPostsByCourseId(courseId, limit, offset);
    return NextResponse.json({ posts, total });
  } catch (error) {
    console.error("Error fetching more info posts:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { courseId, title, content, authorId, authorName } = body;

    if (!courseId || !title || !content || !authorId || !authorName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newPost = await insertMoreInfoPost({
      courseId,
      title,
      content,
      authorId,
      authorName,
      datePosted: new Date(),
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error("Error adding more info post:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
