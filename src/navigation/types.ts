export type AgendaStackParamList = {
  AgendaList: undefined;
  LessonForm: { lessonId?: number; studentId?: number } | undefined;
  LessonDetail: { lessonId: number };
};

export type AlunosStackParamList = {
  StudentsList: undefined;
  StudentForm: { studentId?: number } | undefined;
  StudentDetail: { studentId: number };
};

export type CursosStackParamList = {
  CoursesList: undefined;
  CourseForm: { courseId?: number } | undefined;
};

export type PerfilStackParamList = {
  Perfil: undefined;
};

export type RootTabParamList = {
  AgendaTab: undefined;
  AlunosTab: undefined;
  CursosTab: undefined;
  PerfilTab: undefined;
};
