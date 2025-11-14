import { z } from 'zod';

// 단일 경력 스키마
const careerItemSchema = z.object({
  content: z.string().min(1, '경력 내용은 필수입니다.'),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional().nullable(),
});

// 배열로 경력 일괄 등록/수정
export const createCareerSchema = z.object({
  careers: z.array(careerItemSchema),
});

export const updateCareerSchema = careerItemSchema.partial();

export type CreateCareerRequest = z.infer<typeof createCareerSchema>;
export type UpdateCareerRequest = z.infer<typeof updateCareerSchema>;
