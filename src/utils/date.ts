import { format, isToday, isTomorrow, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function formatLessonDate(iso: string): string {
  const date = parseISO(iso);
  if (isToday(date)) return `Hoje, ${format(date, 'HH:mm')}`;
  if (isTomorrow(date)) return `Amanhã, ${format(date, 'HH:mm')}`;
  return format(date, "EEEE, d 'de' MMMM 'às' HH:mm", { locale: ptBR });
}

export function formatShortDate(iso: string): string {
  return format(parseISO(iso), 'dd/MM/yyyy HH:mm');
}

export function formatDateOnly(iso: string): string {
  return format(parseISO(iso), "d 'de' MMMM 'de' yyyy", { locale: ptBR });
}

export function toDatetimeLocalParts(iso: string): { date: Date } {
  return { date: parseISO(iso) };
}
