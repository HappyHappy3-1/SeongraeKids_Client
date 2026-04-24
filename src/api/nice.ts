import { apiFetch } from './client';

export interface MealsResponse {
  date: string;
  breakfast: string[];
  lunch: string[];
  dinner: string[];
}

export interface TimetablePeriod {
  period: number;
  subject: string;
}

function today(): string {
  const d = new Date();
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
}

export function getMeals(date: string = today()) {
  return apiFetch<MealsResponse>(`/nice/meals?date=${date}`);
}

export function getTimetable(
  date: string = today(),
  grade = '3',
  classNm = '1',
) {
  return apiFetch<TimetablePeriod[]>(
    `/nice/timetable?date=${date}&grade=${grade}&classNm=${classNm}`,
  );
}
