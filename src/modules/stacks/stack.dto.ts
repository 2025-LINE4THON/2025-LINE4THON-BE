import { z } from 'zod';

export const createStackSchema = z.object({
  name: z.string().min(1, '스택 이름은 필수입니다.'),
  level: z.string().optional().nullable(), // ex) Beginner / Intermediate / Advanced
});

export const updateStackSchema = createStackSchema.partial();
