import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core';

export const courseWikis = pgTable('course_wikis', {
  id: serial('id').primaryKey(),
  className: text('class_name').notNull(),  // MATH221, MATH231, etc.
  contentCovered: text('content_covered').array(),  // Array of content topics
  prerequisites: text('prerequisites').array(),  // Array of prerequisites
  whenToTake: text('when_to_take'),  // When to take the course
  courseStructure: text('course_structure'),  // Structure of the course
  instructors: text('instructors').array(),  // List of instructors
  courseTips: text('course_tips'),  // Tips from the community
  lifeAfter: text('life_after'),  // What courses can you take after
  infamousTopics: text('infamous_topics').array(),  // List of challenging topics
  resources: text('resources').array(),  // List of external resources
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export type ICourseWiki = typeof courseWikis.$inferSelect;
export type ICourseWikiInsert = typeof courseWikis.$inferInsert;