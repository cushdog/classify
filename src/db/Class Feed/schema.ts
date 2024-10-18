// db/schema.ts
import { pgTable, serial, text, timestamp, integer, boolean } from 'drizzle-orm/pg-core';

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  classTitle: text('class_title').notNull(),
  userId: text('user_id').notNull(),
  username: text('username').notNull(),
  avatar: text('avatar').notNull(),
  content: text('content').notNull(),
  title: text('title'),
  postType: text('post_type').notNull(),
  eventDate: text('event_date'),
  eventTime: text('event_time'),
  eventLocation: text('event_location'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});


export const replies = pgTable('replies', {
  id: serial('id').primaryKey(),
  postId: integer('post_id').notNull(),
  userId: text('user_id').notNull(),
  username: text('username').notNull(),
  avatar: text('avatar').notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const classes = pgTable('classes', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export type IPost = typeof posts.$inferSelect;
export type IPostInsert = typeof posts.$inferInsert;
export type IReply = typeof replies.$inferSelect;
export type IReplyInsert = typeof replies.$inferInsert;
export type IClass = typeof classes.$inferSelect;
export type IClassInsert = typeof classes.$inferInsert;