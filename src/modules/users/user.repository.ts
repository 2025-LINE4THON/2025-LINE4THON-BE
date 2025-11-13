import { prisma } from '../../config/database';
import { UpdateMyInfoRequest, UserInfoResponse } from './user.dto';

export class UserRepository {
  // 사용자 정보 조회 (by userId)
  async findById(userId: number): Promise<UserInfoResponse | null> {
    const user = await prisma.user.findUnique({
      where: { userId },
      select: {
        userId: true,
        username: true,
        name: true,
        email: true,
        phoneNumber: true,
        introduction: true,
        job: true,
      },
    });

    if (!user) return null;

    // Prisma의 null을 undefined로 변환
    return {
      userId: user.userId,
      username: user.username,
      name: user.name ?? undefined,
      email: user.email ?? undefined,
      phoneNumber: user.phoneNumber ?? undefined,
      introduction: user.introduction ?? undefined,
      job: user.job ?? undefined,
    };
  }

  // 사용자 정보 수정
  async updateUserInfo(userId: number, data: UpdateMyInfoRequest): Promise<UserInfoResponse> {
    const user = await prisma.user.update({
      where: { userId },
      data,
      select: {
        userId: true,
        username: true,
        name: true,
        email: true,
        phoneNumber: true,
        introduction: true,
        job: true,
      },
    });

    // Prisma의 null을 undefined로 변환
    return {
      userId: user.userId,
      username: user.username,
      name: user.name ?? undefined,
      email: user.email ?? undefined,
      phoneNumber: user.phoneNumber ?? undefined,
      introduction: user.introduction ?? undefined,
      job: user.job ?? undefined,
    };
  }

  // 내 경력 목록 조회
  async findMyCareers(userId: number) {
    return prisma.career.findMany({
      where: { userId },
      orderBy: { startDate: 'desc' },
    });
  }

  // 내 자격증 목록 조회
  async findMyLicenses(userId: number) {
    return prisma.license.findMany({
      where: { userId },
      orderBy: { gotDate: 'desc' },
    });
  }

  // 내 스택 목록 조회
  async findMyStacks(userId: number) {
    return prisma.stack.findMany({
      where: { userId },
      orderBy: { stackId: 'asc' },
    });
  }

  // 내 프로젝트 목록 조회
  async findMyProjects(userId: number) {
    return prisma.project.findMany({
      where: { userId },
      orderBy: { startDate: 'desc' },
      include: {
        projectTags: true,
        projectStacks: true,
        links: true,
      },
    });
  }

  // 내 포트폴리오 목록 조회
  async findMyPortfolios(userId: number) {
    return prisma.portfolio.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        portfolioStacks: {
          include: {
            stack: true,
          },
        },
        portfolioCareers: {
          include: {
            career: true,
          },
        },
        projects: {
          select: {
            projectId: true,
            title: true,
            thumbnail: true,
          },
        },
      },
    });
  }
}
