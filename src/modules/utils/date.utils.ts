/**
 * 날짜/시간 유틸리티 함수
 */

/**
 * 현재 날짜/시간 반환
 */
export function now(): Date {
  return new Date();
}

/**
 * 날짜 포맷팅 (YYYY-MM-DD)
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 날짜/시간 포맷팅 (YYYY-MM-DD HH:mm:ss)
 */
export function formatDateTime(date: Date): string {
  const dateStr = formatDate(date);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${dateStr} ${hours}:${minutes}:${seconds}`;
}

/**
 * 날짜에 일수 추가
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * 날짜에 월 추가
 */
export function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

/**
 * 날짜에 년 추가
 */
export function addYears(date: Date, years: number): Date {
  const result = new Date(date);
  result.setFullYear(result.getFullYear() + years);
  return result;
}

/**
 * 두 날짜 사이의 일수 차이
 */
export function daysBetween(date1: Date, date2: Date): number {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round(Math.abs((date1.getTime() - date2.getTime()) / oneDay));
}

/**
 * 날짜가 범위 내에 있는지 확인
 */
export function isDateInRange(
  date: Date,
  startDate: Date,
  endDate: Date,
): boolean {
  return date >= startDate && date <= endDate;
}

/**
 * 오늘인지 확인
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * 과거 날짜인지 확인
 */
export function isPast(date: Date): boolean {
  return date < new Date();
}

/**
 * 미래 날짜인지 확인
 */
export function isFuture(date: Date): boolean {
  return date > new Date();
}

/**
 * 한국 시간대로 변환
 */
export function toKoreanTime(date: Date): Date {
  const offset = 9 * 60; // UTC+9
  return new Date(date.getTime() + offset * 60 * 1000);
}
