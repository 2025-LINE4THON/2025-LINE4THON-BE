/**
 * 문자열 유틸리티 함수
 */

/**
 * 문자열을 슬러그로 변환 (URL 친화적)
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * 랜덤 문자열 생성
 */
export function generateRandomString(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * 이메일 검증
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 전화번호 포맷팅 (010-1234-5678)
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{4})(\d{4})$/);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }
  return phone;
}

/**
 * 문자열 자르기 (말줄임표 포함)
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * 첫 글자 대문자로
 */
export function capitalize(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * 카멜케이스를 스네이크케이스로
 */
export function camelToSnake(text: string): string {
  return text.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

/**
 * 스네이크케이스를 카멜케이스로
 */
export function snakeToCamel(text: string): string {
  return text.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * 마스킹 (이메일, 전화번호 등)
 */
export function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!local || !domain) return email;
  
  const maskedLocal = local.length > 2 
    ? local[0] + '*'.repeat(local.length - 2) + local[local.length - 1]
    : local;
  
  return `${maskedLocal}@${domain}`;
}

export function maskPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length !== 11) return phone;
  
  return `${cleaned.substring(0, 3)}-****-${cleaned.substring(7)}`;
}

/**
 * 문자열에서 HTML 태그 제거
 */
export function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

/**
 * 문자열을 배열로 분할 (쉼표 구분)
 */
export function splitByComma(text: string): string[] {
  return text.split(',').map((item) => item.trim()).filter(Boolean);
}
