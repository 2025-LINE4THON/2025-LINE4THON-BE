import { z } from 'zod';

// 내 정보 수정 DTO
export const UpdateMyInfoDto = z.object({
  name: z.string().min(2, '이름은 최소 2자 이상이어야 합니다.').optional(),
  email: z.string().email('유효한 이메일 주소를 입력해주세요.').optional(),
  phoneNumber: z.number().optional(),
  introduction: z.string().optional(),
  job: z.string().optional(),
});

export type UpdateMyInfoRequest = z.infer<typeof UpdateMyInfoDto>;

// 사용자 정보 응답 DTO
export interface UserInfoResponse {
  userId: number;
  username: string;
  name?: string;
  email?: string;
  phoneNumber?: number;
  introduction?: string;
  job?: string;
}
