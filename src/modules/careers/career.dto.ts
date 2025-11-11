import { z } from 'zod';

export const createCareerSchema = z.object({
  content: z.string().min(1, '경력 내용은 필수입니다.'),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional().nullable(),
});

export const updateCareerSchema = createCareerSchema.partial();
