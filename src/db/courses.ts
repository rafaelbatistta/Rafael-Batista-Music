import { getDb } from './database';
import { Course, CourseStatus } from '../types';

export interface CourseInput {
  title: string;
  category?: string | null;
  description?: string | null;
  link?: string | null;
  status?: CourseStatus;
}

export async function listCourses(): Promise<Course[]> {
  const db = await getDb();
  return db.getAllAsync<Course>('SELECT * FROM courses ORDER BY createdAt DESC;');
}

export async function getCourse(id: number): Promise<Course | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<Course>('SELECT * FROM courses WHERE id = ?;', id);
  return row ?? null;
}

export async function createCourse(input: CourseInput): Promise<number> {
  const db = await getDb();
  const result = await db.runAsync(
    `INSERT INTO courses (title, category, description, link, status, createdAt)
     VALUES (?, ?, ?, ?, ?, ?);`,
    input.title,
    input.category ?? null,
    input.description ?? null,
    input.link ?? null,
    input.status ?? 'a_fazer',
    new Date().toISOString()
  );
  return result.lastInsertRowId;
}

export async function updateCourse(id: number, input: CourseInput): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `UPDATE courses SET title = ?, category = ?, description = ?, link = ?, status = ?
     WHERE id = ?;`,
    input.title,
    input.category ?? null,
    input.description ?? null,
    input.link ?? null,
    input.status ?? 'a_fazer',
    id
  );
}

export async function deleteCourse(id: number): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM courses WHERE id = ?;', id);
}
