import { z } from 'zod';

// 단일 자격증 스키마
const licenseItemSchema = z.object({
  name: z.string().min(1, '자격증 이름은 필수입니다.'),
  gotDate: z.coerce.date(),                 // 문자열도 Date로 변환
  endDate: z.coerce.date().optional().nullable(),
});

// 배열로 자격증 일괄 등록/수정
export const createLicenseSchema = z.object({
  licenses: z.array(licenseItemSchema),
});

export const updateLicenseSchema = licenseItemSchema.partial();

export type CreateLicenseRequest = z.infer<typeof createLicenseSchema>;
export type UpdateLicenseRequest = z.infer<typeof updateLicenseSchema>;
