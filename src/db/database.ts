import * as SQLite from 'expo-sqlite';

const DB_NAME = 'registro_de_aulas.db';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

async function init(db: SQLite.SQLiteDatabase) {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      instrument TEXT NOT NULL,
      phone TEXT,
      email TEXT,
      monthlyFee REAL,
      weekday TEXT,
      time TEXT,
      notes TEXT,
      active INTEGER NOT NULL DEFAULT 1,
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS lessons (
      id INTEGER PRIMARY KEY NOT NULL,
      studentId INTEGER NOT NULL,
      date TEXT NOT NULL,
      durationMinutes INTEGER NOT NULL DEFAULT 60,
      status TEXT NOT NULL DEFAULT 'scheduled',
      content TEXT,
      notes TEXT,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      category TEXT,
      description TEXT,
      link TEXT,
      status TEXT NOT NULL DEFAULT 'a_fazer',
      createdAt TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_lessons_date ON lessons (date);
    CREATE INDEX IF NOT EXISTS idx_lessons_student ON lessons (studentId);
  `);
}

export function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = (async () => {
      const db = await SQLite.openDatabaseAsync(DB_NAME);
      await init(db);
      return db;
    })();
  }
  return dbPromise;
}
