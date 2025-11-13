import { z } from 'zod';

export const createLicenseSchema = z.object({
  name: z.string().min(1, '자격증 이름은 필수입니다.'),
  gotDate: z.coerce.date(),                 // 문자열도 Date로 변환
  endDate: z.coerce.date().optional().nullable(),
});

export const updateLicenseSchema = createLicenseSchema.partial();
