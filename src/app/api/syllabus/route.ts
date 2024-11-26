// app/api/syllabus/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSyllabusByCourseId, insertSyllabusFile } from "@/db/Syllabus/operations";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const courseId = searchParams.get("courseId");

  if (!courseId) {
    return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
  }

  try {
    const syllabus = await getSyllabusByCourseId(courseId);
    if (syllabus) {
      return NextResponse.json(syllabus);
    } else {
      return NextResponse.json(null);
    }
  } catch (error) {
    console.error("Error fetching syllabus:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const courseId = formData.get("courseId") as string | null;
    const uploadedBy = formData.get("uploadedBy") as string | null; // Assume you pass this from the frontend

    if (!file || !courseId || !uploadedBy) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Here, you should handle file upload to a storage service (e.g., AWS S3, Cloudinary)
    // and obtain the file URL. For demonstration, let's assume the file URL is constructed as follows:
    const fileUrl = `/uploads/${file.name}`; // Replace with actual upload logic

    const newSyllabus = await insertSyllabusFile({
      courseId,
      fileName: file.name,
      fileUrl,
      uploadedBy,
    });

    return NextResponse.json(newSyllabus, { status: 201 });
  } catch (error) {
    console.error("Error uploading syllabus:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
