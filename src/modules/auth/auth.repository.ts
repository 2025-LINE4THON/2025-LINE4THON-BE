import { CommonRepository } from '../../common/common.repository';
import { prisma } from '../../config/database';
import { User } from '@prisma/client';

export class AuthRepository extends CommonRepository<User> {
  constructor() {
    super(prisma, prisma.user);
  }

  // username으로 사용자 찾기
  async findByUsername(username: string): Promise<User | null> {
    return this.model.findFirst({
      where: { username },
    });
  }

  // 이메일로 사용자 찾기
  async findByEmail(email: string): Promise<User | null> {
    return this.model.findFirst({
      where: { email },
    });
  }

  // 사용자 생성 (비밀번호 제외하고 반환)
  async createUser(data: Partial<User>): Promise<Omit<User, 'password'>> {
    const user = await this.model.create({
      data,
      select: {
        userId: true,
        username: true,
        name: true,
        email: true,
        phoneNumber: true,
        introduction: true,
        job: true,
        // password는 제외
      },
    });
    return user;
  }
}
