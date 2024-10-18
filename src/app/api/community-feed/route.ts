import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/auth";
import { db } from '@/db/db';
import { posts, replies, classes } from '@/db/schema';
import { eq, like, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {

  console.log("GET request received");
  const session = await getServerSession(authOptions);
  
  if (!session) {
    console.log("Unauthorized access attempt");
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const classTitle = searchParams.get('classTitle');
  const search = searchParams.get('search');

  try {

    if (search) {
      console.log(`Searching for classes with search term: ${search}`);
      const matchingClasses = await db.select().from(classes)
        .where(like(classes.name, `%${search}%`));
      console.log("Matching classes:", matchingClasses);
      return NextResponse.json(matchingClasses);
    }

    if (!classTitle) {
      console.log("Class title is missing in GET request");
      return NextResponse.json({ error: 'Class title is required' }, { status: 400 });
    }

    console.log(`Fetching posts for classTitle: ${classTitle}`);
    const postsData = await db.select().from(posts)
      .where(eq(posts.classTitle, classTitle))
      .orderBy(desc(posts.createdAt));

    const postsWithReplies = await Promise.all(postsData.map(async (post) => {
      const repliesData = await db.select().from(replies)
        .where(eq(replies.postId, post.id))
        .orderBy(desc(replies.createdAt));
      return { ...post, replies: repliesData };
    }));

    console.log("Posts fetched with replies:", postsWithReplies);
    return NextResponse.json(postsWithReplies);
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {

  console.log("POST request received");
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    console.log("Unauthorized access attempt in POST");
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {

    const body = await request.json();
    const { type, data } = body;

    console.log("POST body received:", body);

    if (type === 'post') {

      console.log("Inserting new post:", data);
      const newPost = await db.insert(posts).values({
        ...data,
        userId: session.user.id,
        username: session.user.name || '',
        avatar: session.user.image || '',
      }).returning();
      console.log("New post inserted:", newPost);
      return NextResponse.json(newPost[0], { status: 201 });

    } else if (type === 'reply') {

      console.log("Inserting new reply:", data);
      const newReply = await db.insert(replies).values({
        ...data,
        userId: session.user.id,
        username: session.user.name || '',
        avatar: session.user.image || '',
      }).returning();
      console.log("New reply inserted:", newReply);
      return NextResponse.json(newReply[0], { status: 201 });

    } else {
      console.log("Invalid type in POST request");
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error creating post/reply:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
