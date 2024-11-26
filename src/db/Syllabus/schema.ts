// db/syllabusSchema.ts
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const syllabusFiles = pgTable('syllabus_files', {
  id: serial('id').primaryKey(),
  courseId: text('course_id').notNull(),
  fileName: text('file_name').notNull(),
  fileUrl: text('file_url').notNull(),
  uploadedAt: timestamp('uploaded_at').defaultNow().notNull(),
  uploadedBy: text('uploaded_by').notNull(),
});

export type ISyllabusFile = typeof syllabusFiles.$inferSelect;
export type ISyllabusFileInsert = typeof syllabusFiles.$inferInsert;
