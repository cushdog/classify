const DATABASE_URL =
  process.env.DATABASE_URL ||
  'postgresql://root:root@localhost:5432/CourseExplorer';

export const Config = {
  DATABASE_URL
};