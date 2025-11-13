import { z, ZodError, ZodObject, ZodSchema, ZodIssue } from 'zod';
import { AppError } from '../../middleware/errorHandler';

/**
 * Zod 스키마 검증 유틸리티
 */
export function validate<T>(schema: ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof ZodError) {
      const messages = error.issues
        .map((err: ZodIssue) => `${err.path.join('.')}: ${err.message}`)
        .join(', ');
      throw new AppError(`유효성 검사 실패: ${messages}`, 400);
    }
    throw error;
  }
}

/**
 * 비동기 검증 (DB 조회 등이 필요한 경우)
 */
export async function validateAsync<T>(
  schema: ZodSchema<T>,
  data: unknown,
): Promise<T> {
  try {
    return await schema.parseAsync(data);
  } catch (error) {
    if (error instanceof ZodError) {
      const messages = error.issues
        .map((err: ZodIssue) => `${err.path.join('.')}: ${err.message}`)
        .join(', ');
      throw new AppError(`유효성 검사 실패: ${messages}`, 400);
    }
    throw error;
  }
}

/**
 * 부분 검증 (선택적 필드만 검증)
 */
export function validatePartial<T>(
  schema: ZodSchema<T>,
  data: unknown,
): Partial<T> {
  const partialSchema = schema instanceof ZodObject ? schema.partial() : schema;
  return validate(partialSchema, data);
}

/**
 * 공통 검증 스키마
 */
export const commonSchemas = {
  // ID 검증
  id: z.number().int().positive('ID는 양수여야 합니다'),

  // 페이지네이션
  pagination: z.object({
    page: z.number().int().min(1, '페이지는 1 이상이어야 합니다').optional().default(1),
    limit: z
      .number()
      .int()
      .min(1)
      .max(100, '한 페이지에 최대 100개까지 조회 가능합니다')
      .optional()
      .default(10),
  }),

  // 날짜 범위
  dateRange: z.object({
    startDate: z.string().datetime('올바른 날짜 형식이 아닙니다').optional(),
    endDate: z.string().datetime('올바른 날짜 형식이 아닙니다').optional(),
  }),

  // 정렬
  sort: z.object({
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
  }),
};
