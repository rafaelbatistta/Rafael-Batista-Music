import { getDb } from './database';
import { Student } from '../types';

export interface StudentInput {
  name: string;
  instrument: string;
  phone?: string | null;
  email?: string | null;
  monthlyFee?: number | null;
  weekday?: string | null;
  time?: string | null;
  notes?: string | null;
}

export async function listStudents(includeInactive = false): Promise<Student[]> {
  const db = await getDb();
  if (includeInactive) {
    return db.getAllAsync<Student>('SELECT * FROM students ORDER BY name ASC;');
  }
  return db.getAllAsync<Student>(
    'SELECT * FROM students WHERE active = 1 ORDER BY name ASC;'
  );
}

export async function getStudent(id: number): Promise<Student | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<Student>(
    'SELECT * FROM students WHERE id = ?;',
    id
  );
  return row ?? null;
}

export async function createStudent(input: StudentInput): Promise<number> {
  const db = await getDb();
  const result = await db.runAsync(
    `INSERT INTO students (name, instrument, phone, email, monthlyFee, weekday, time, notes, active, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?);`,
    input.name,
    input.instrument,
    input.phone ?? null,
    input.email ?? null,
    input.monthlyFee ?? null,
    input.weekday ?? null,
    input.time ?? null,
    input.notes ?? null,
    new Date().toISOString()
  );
  return result.lastInsertRowId;
}

export async function updateStudent(id: number, input: StudentInput): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `UPDATE students SET name = ?, instrument = ?, phone = ?, email = ?, monthlyFee = ?, weekday = ?, time = ?, notes = ?
     WHERE id = ?;`,
    input.name,
    input.instrument,
    input.phone ?? null,
    input.email ?? null,
    input.monthlyFee ?? null,
    input.weekday ?? null,
    input.time ?? null,
    input.notes ?? null,
    id
  );
}

export async function setStudentActive(id: number, active: boolean): Promise<void> {
  const db = await getDb();
  await db.runAsync('UPDATE students SET active = ? WHERE id = ?;', active ? 1 : 0, id);
}

export async function deleteStudent(id: number): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM lessons WHERE studentId = ?;', id);
  await db.runAsync('DELETE FROM students WHERE id = ?;', id);
}
