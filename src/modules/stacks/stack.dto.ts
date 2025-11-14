import { z } from 'zod';

// 단일 스택 스키마
const stackItemSchema = z.object({
  name: z.string().min(1, '스택 이름은 필수입니다.'),
  level: z.string().optional().nullable(), // ex) Beginner / Intermediate / Advanced
});

// 배열로 스택 일괄 등록/수정
export const createStackSchema = z.object({
  stacks: z.array(stackItemSchema),
});

export const updateStackSchema = stackItemSchema.partial();

export type CreateStackRequest = z.infer<typeof createStackSchema>;
export type UpdateStackRequest = z.infer<typeof updateStackSchema>;
