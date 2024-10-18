import { pgTable, serial, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';

export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  isClassReview: boolean('is_class_review').notNull(),
  name: text('name').notNull(),
  email: text('email').notNull(),  // Added email field
  overallRating: integer('overall_rating').notNull(),
  comment: text('comment').notNull(),
  tags: text('tags').array(),
  conceptualDifficulty: integer('conceptual_difficulty'),
  weeklyWorkload: integer('weekly_workload'),
  recommendability: integer('recommendability'),
  professorEngagement: integer('professor_engagement'),
  lectureQuality: integer('lecture_quality'),
  assignmentQuality: integer('assignment_quality'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export type IReview = typeof reviews.$inferSelect;
export type IReviewInsert = typeof reviews.$inferInsert;