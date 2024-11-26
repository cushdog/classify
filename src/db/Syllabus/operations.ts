// db/syllabusOperations.ts
import { db } from "../db";
import { eq } from "drizzle-orm";
import { syllabusFiles, ISyllabusFile, ISyllabusFileInsert } from "./schema";

// Syllabus File Operations
export const getSyllabusByCourseId = async (courseId: string): Promise<ISyllabusFile | null> => {
  const res = await db.select().from(syllabusFiles).where(eq(syllabusFiles.courseId, courseId));
  return res?.[0] ?? null;
};

export const insertSyllabusFile = async (
  data: ISyllabusFileInsert
): Promise<ISyllabusFile | null> => {
  const res = await db.insert(syllabusFiles).values(data).returning();
  return res?.[0] ?? null;
};

export const deleteSyllabusFile = async (id: number): Promise<ISyllabusFile | null> => {
  const res = await db.delete(syllabusFiles).where(eq(syllabusFiles.id, id)).returning();
  return res?.[0] ?? null;
};
