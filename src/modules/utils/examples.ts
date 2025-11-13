/**
 * 유틸리티 함수 사용 예시
 */

import { prisma } from '../../config/database';
import {
  findOne,
  findManyWithPagination,
  createOne,
  updateOne,
  deleteOne,
  validate,
  formatDate,
  slugify,
  maskEmail,
} from '../utils';
import { z } from 'zod';

// ============================================
// 1. CRUD 유틸리티 사용 예시
// ============================================

// 단일 조회
async function getUser(userId: number) {
  return findOne(
    prisma.user,
    userId,
    { projects: true, portfolios: true },
    '사용자를 찾을 수 없습니다',
  );
}

// 페이지네이션 조회
async function getUsers(page: number, limit: number) {
  return findManyWithPagination(prisma.user, {
    page,
    limit,
    where: { email: { not: null } },
    orderBy: { userId: 'desc' },
  });
}

// 생성
async function createUser(data: { name: string; username: string; password: string }) {
  return createOne(prisma.user, data, { portfolios: true });
}

// 업데이트
async function updateUser(userId: number, data: { name?: string; email?: string }) {
  return updateOne(prisma.user, userId, data);
}

// 삭제
async function deleteUser(userId: number) {
  return deleteOne(prisma.user, userId, '삭제할 사용자를 찾을 수 없습니다');
}

// ============================================
// 2. 검증 유틸리티 사용 예시
// ============================================

const userSchema = z.object({
  name: z.string().min(2, '이름은 2자 이상이어야 합니다'),
  username: z.string().min(3, '사용자명은 3자 이상이어야 합니다'),
  email: z.string().email('올바른 이메일 형식이 아닙니다').optional(),
  password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다'),
});

function validateUserData(data: unknown) {
  return validate(userSchema, data);
}

// ============================================
// 3. 날짜 유틸리티 사용 예시
// ============================================

function getFormattedDate() {
  const today = new Date();
  return formatDate(today); // "2025-11-09"
}

// ============================================
// 4. 문자열 유틸리티 사용 예시
// ============================================

function createProjectSlug(title: string) {
  return slugify(title); // "My Awesome Project" -> "my-awesome-project"
}

function hideUserEmail(email: string) {
  return maskEmail(email); // "user@example.com" -> "u**r@example.com"
}

export {
  getUser,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  validateUserData,
  getFormattedDate,
  createProjectSlug,
  hideUserEmail,
};
