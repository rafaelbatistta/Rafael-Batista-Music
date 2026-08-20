import { getDb } from './database';
import { Lesson, LessonStatus, LessonWithStudent } from '../types';

export interface LessonInput {
  studentId: number;
  date: string;
  durationMinutes: number;
  status?: LessonStatus;
  content?: string | null;
  notes?: string | null;
}

const SELECT_WITH_STUDENT = `
  SELECT lessons.*, students.name AS studentName, students.instrument AS studentInstrument
  FROM lessons
  JOIN students ON students.id = lessons.studentId
`;

export async function listLessons(): Promise<LessonWithStudent[]> {
  const db = await getDb();
  return db.getAllAsync<LessonWithStudent>(
    `${SELECT_WITH_STUDENT} ORDER BY lessons.date ASC;`
  );
}

export async function listUpcomingLessons(fromIso: string): Promise<LessonWithStudent[]> {
  const db = await getDb();
  return db.getAllAsync<LessonWithStudent>(
    `${SELECT_WITH_STUDENT} WHERE lessons.date >= ? AND lessons.status = 'scheduled' ORDER BY lessons.date ASC;`,
    fromIso
  );
}

export async function listPastLessons(beforeIso: string): Promise<LessonWithStudent[]> {
  const db = await getDb();
  return db.getAllAsync<LessonWithStudent>(
    `${SELECT_WITH_STUDENT} WHERE lessons.date < ? OR lessons.status != 'scheduled' ORDER BY lessons.date DESC;`,
    beforeIso
  );
}

export async function listLessonsByStudent(studentId: number): Promise<Lesson[]> {
  const db = await getDb();
  return db.getAllAsync<Lesson>(
    'SELECT * FROM lessons WHERE studentId = ? ORDER BY date DESC;',
    studentId
  );
}

export async function getLesson(id: number): Promise<LessonWithStudent | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<LessonWithStudent>(
    `${SELECT_WITH_STUDENT} WHERE lessons.id = ?;`,
    id
  );
  return row ?? null;
}

export async function createLesson(input: LessonInput): Promise<number> {
  const db = await getDb();
  const result = await db.runAsync(
    `INSERT INTO lessons (studentId, date, durationMinutes, status, content, notes, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?);`,
    input.studentId,
    input.date,
    input.durationMinutes,
    input.status ?? 'scheduled',
    input.content ?? null,
    input.notes ?? null,
    new Date().toISOString()
  );
  return result.lastInsertRowId;
}

export async function updateLesson(id: number, input: LessonInput): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `UPDATE lessons SET studentId = ?, date = ?, durationMinutes = ?, status = ?, content = ?, notes = ?
     WHERE id = ?;`,
    input.studentId,
    input.date,
    input.durationMinutes,
    input.status ?? 'scheduled',
    input.content ?? null,
    input.notes ?? null,
    id
  );
}

export async function markLessonDone(
  id: number,
  content: string | null,
  notes: string | null
): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `UPDATE lessons SET status = 'done', content = ?, notes = ? WHERE id = ?;`,
    content,
    notes,
    id
  );
}

export async function cancelLesson(id: number): Promise<void> {
  const db = await getDb();
  await db.runAsync(`UPDATE lessons SET status = 'canceled' WHERE id = ?;`, id);
}

export async function deleteLesson(id: number): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM lessons WHERE id = ?;', id);
}
