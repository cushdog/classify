// db/moreInfoSchema.ts
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const moreInfoPosts = pgTable('more_info_posts', {
  id: serial('id').primaryKey(),
  courseId: text('course_id').notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  authorId: text('author_id').notNull(),
  authorName: text('author_name').notNull(),
  datePosted: timestamp('date_posted').defaultNow().notNull(),
});

export type IMoreInfoPost = typeof moreInfoPosts.$inferSelect;
export type IMoreInfoPostInsert = typeof moreInfoPosts.$inferInsert;
