// db/schema.ts
import { pgTable, serial, text, timestamp, varchar, integer } from 'drizzle-orm/pg-core';

export const blogPosts = pgTable('blog_posts', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  excerpt: text('excerpt').notNull(),
  content: text('content').notNull(),
  authorId: text('author_id').notNull(),
  authorName: text('author_name').notNull(),
  authorRole: text('author_role'),
  authorAvatar: text('author_avatar'),
  readTime: integer('read_time').notNull(),
  tags: text('tags').array().notNull(),
  likes: integer('likes').default(0).notNull(),
  comments: integer('comments').default(0).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const blogComments = pgTable('blog_comments', {
  id: serial('id').primaryKey(),
  postId: integer('post_id').notNull(),
  authorId: text('author_id').notNull(),
  authorName: text('author_name').notNull(),
  authorAvatar: text('author_avatar'),
  content: text('content').notNull(),
  likes: integer('likes').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export type IBlogPost = typeof blogPosts.$inferSelect;
export type IBlogPostInsert = typeof blogPosts.$inferInsert;
export type IBlogComment = typeof blogComments.$inferSelect;
export type IBlogCommentInsert = typeof blogComments.$inferInsert;