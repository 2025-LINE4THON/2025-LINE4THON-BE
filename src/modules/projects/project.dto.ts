import { z } from 'zod';

export const createProjectSchema = z.object({
  title: z.string().min(1),
  startDate: z.coerce.date(),           // 문자열도 Date로 변환
  endDate: z.coerce.date().optional().nullable(),
  role: z.string().optional().nullable(),
  thumbnail: z.string().url().optional().nullable(),
  // 선택 관계들
  tags: z.array(z.string()).optional(),
  stacks: z.array(z.object({
    stackId: z.number().int().positive(),
    stackName: z.string(),
  })).optional(),
  contents: z.array(z.object({
    title: z.string().min(1),
    content: z.string(),  // 빈 문자열 허용
  })).optional(),
  images: z.array(z.string().url()).optional(),
  links: z.array(z.object({
    name: z.string().min(1),
    url: z.string().url(),
    linkSite: z.string().optional(),
  })).optional(),
});

export const updateProjectSchema = createProjectSchema.partial();
