import { z } from 'zod';

export const createProjectSchema = z.object({
  title: z.string().min(1),
  startDate: z.coerce.date(),           // 문자열도 Date로 변환
  endDate: z.coerce.date().optional().nullable(),
  role: z.string().optional().nullable(),
  thumbnail: z.string().url().optional().nullable(),
  // 선택 관계들
  tags: z.array(z.string()).optional(),
  stacks: z.preprocess(
    (val) => {
      if (!Array.isArray(val)) return [];
      // 빈 객체나 stackName/stackname이 없는 항목 제거 및 정규화
      return val
        .filter((item: any) => item && (item.stackName || item.stackname))
        .map((item: any) => ({
            stackName: item.stackName || item.stackname, // 대소문자 모두 지원
            stackId: item.stackId ?? undefined,
        }));
    },
      z.array(z.object({
        stackName: z.string().min(1),
        stackId: z.number().optional(),
      }))
  ).optional().default([]),
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
