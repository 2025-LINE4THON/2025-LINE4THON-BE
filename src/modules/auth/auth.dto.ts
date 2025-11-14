import { z } from 'zod';

// 회원가입 DTO - username과 password만 필수
export const SignupDto = z.object({
  username: z.string().min(3, '사용자명은 최소 3자 이상이어야 합니다.'),
  password: z.string().min(8, '비밀번호는 최소 8자 이상이어야 합니다.'),
  name: z.string().min(2, '이름은 최소 2자 이상이어야 합니다.').optional(),
  email: z.string().email('유효한 이메일 주소를 입력해주세요.').optional(),
  phoneNumber: z.string().optional(),
  introduction: z.string().optional(),
  job: z.string().optional(),
});

// 로그인 DTO
export const LoginDto = z.object({
  username: z.string().min(1, '사용자명을 입력해주세요.'),
  password: z.string().min(1, '비밀번호를 입력해주세요.'),
});

// 아이디 중복 확인 DTO
export const CheckIdDto = z.object({
  username: z.string().min(3, '사용자명은 최소 3자 이상이어야 합니다.'),
});

// 타입 추론
export type SignupRequest = z.infer<typeof SignupDto>;
export type LoginInput = z.infer<typeof LoginDto>;
export type CheckIdRequest = z.infer<typeof CheckIdDto>;
