export interface Student {
  id: number;
  name: string;
  instrument: string;
  phone: string | null;
  email: string | null;
  monthlyFee: number | null;
  weekday: string | null;
  time: string | null;
  notes: string | null;
  active: number;
  createdAt: string;
}

export type LessonStatus = 'scheduled' | 'done' | 'canceled';

export interface Lesson {
  id: number;
  studentId: number;
  date: string;
  durationMinutes: number;
  status: LessonStatus;
  content: string | null;
  notes: string | null;
  createdAt: string;
}

export interface LessonWithStudent extends Lesson {
  studentName: string;
  studentInstrument: string;
}

export type CourseStatus = 'a_fazer' | 'em_andamento' | 'concluido';

export interface Course {
  id: number;
  title: string;
  category: string | null;
  description: string | null;
  link: string | null;
  status: CourseStatus;
  createdAt: string;
}
