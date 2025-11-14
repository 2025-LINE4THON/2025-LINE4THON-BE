import { CommonRepository } from '../../common/common.repository';
import { prisma } from '../../config/database';
import { 
  PortfolioResponseDto, 
  PortfolioDetailResponseDto,
  CreatePortfolioDtoType,
  UpdatePortfolioDtoType
} from './portpolios.dto';

export class PortfolioRepository extends CommonRepository<PortfolioResponseDto> {
  constructor() {
    super(prisma, prisma.portfolio);
  }

  // 포트폴리오 생성 (Relations 포함) - API 명세에 맞춤
  async createWithRelations(userId: number, data: CreatePortfolioDtoType) {
    const { skills, careers, projectIds, template, aboutMe, introduction, ...portfolioData } = data;

    return this.prisma.$transaction(async (tx) => {
      // 1. Portfolio 생성
      const portfolio = await tx.portfolio.create({
        data: {
          title: portfolioData.title,
          thumbnail: portfolioData.thumbnail,
          coverImage: portfolioData.coverImage,
          template: template,
          isPublic: portfolioData.isPublic,
          introduction: introduction,
          aboutMe: aboutMe ? JSON.stringify(aboutMe) : undefined,
          userId,
        },
      });

      // 2. PortfolioStack 생성 (skills 배열에서)
      if (skills && skills.length > 0) {
        await tx.portfolioStack.createMany({
          data: skills.map((skill) => ({
            portfolioId: portfolio.portfolioId,
            stackId: skill.id,
            userId,
            rank: skill.rank,
          })),
        });
      }

      // 3. PortfolioCareer 생성 (careers 배열에서)
      if (careers && careers.length > 0) {
        await tx.portfolioCareer.createMany({
          data: careers.map((career) => ({
            portfolioId: portfolio.portfolioId,
            careerId: career.id,
            userId,
            description: career.description,
          })),
        });
      }

      // 4. Portfolio-Project 연결 (many-to-many)
      if (projectIds && projectIds.length > 0) {
        await tx.portfolio.update({
          where: { portfolioId: portfolio.portfolioId },
          data: {
            projects: {
              connect: projectIds.map((projectId) => ({ projectId })),
            },
          },
        });
      }

      return portfolio;
    });
  }

  // 포트폴리오 수정 (Relations 포함) - API 명세에 맞춤
  async updateWithRelations(
    portfolioId: number, 
    userId: number, 
    data: UpdatePortfolioDtoType
  ) {
    const { skills, careers, projectIds, template, introduction, aboutMe, ...portfolioData } = data;

    return this.prisma.$transaction(async (tx) => {
      // 1. Portfolio 기본 정보 수정
      const updateData: any = {};
      if (portfolioData.title !== undefined) updateData.title = portfolioData.title;
      if (portfolioData.thumbnail !== undefined) updateData.thumbnail = portfolioData.thumbnail;
      if (portfolioData.coverImage !== undefined) updateData.coverImage = portfolioData.coverImage;
      if (template !== undefined) updateData.template = template;
      if (portfolioData.isPublic !== undefined) updateData.isPublic = portfolioData.isPublic;
      if (introduction !== undefined) updateData.introduction = introduction;
      if (aboutMe !== undefined) updateData.aboutMe = JSON.stringify(aboutMe);

      const portfolio = await tx.portfolio.update({
        where: { portfolioId },
        data: updateData,
      });

      // 2. PortfolioStack 업데이트 (기존 삭제 후 재생성)
      if (skills !== undefined) {
        await tx.portfolioStack.deleteMany({
          where: { portfolioId, userId },
        });
        
        if (skills.length > 0) {
          await tx.portfolioStack.createMany({
            data: skills.map((skill) => ({
              portfolioId,
              stackId: skill.id,
              userId,
              rank: skill.rank,
            })),
          });
        }
      }

      // 3. PortfolioCareer 업데이트 (기존 삭제 후 재생성)
      if (careers !== undefined) {
        await tx.portfolioCareer.deleteMany({
          where: { portfolioId, userId },
        });
        
        if (careers.length > 0) {
          await tx.portfolioCareer.createMany({
            data: careers.map((career) => ({
              portfolioId,
              careerId: career.id,
              userId,
              description: career.description,
            })),
          });
        }
      }

      // 4. Portfolio-Project 연결 업데이트
      if (projectIds !== undefined) {
        // 기존 연결 모두 해제
        await tx.portfolio.update({
          where: { portfolioId },
          data: {
            projects: {
              set: [], // 기존 연결 모두 제거
            },
          },
        });

        // 새 연결 생성
        if (projectIds.length > 0) {
          await tx.portfolio.update({
            where: { portfolioId },
            data: {
              projects: {
                connect: projectIds.map((projectId) => ({ projectId })),
              },
            },
          });
        }
      }

      return portfolio;
    });
  }

  // 사용자별 포트폴리오 목록 조회
  async findByUserId(userId: number): Promise<PortfolioResponseDto[]> {
    const portfolios = await this.model.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        portfolioId: true,
        userId: true,
        title: true,
        thumbnail: true,
        coverImage: true,
        template: true,
        views: true,
        likesCount: true,
        isPublic: true,
        introduction: true,
        aboutMe: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            name: true,
            job: true,
            email: true,
            phoneNumber: true,
          },
        },
      },
    });

    return portfolios.map((p: any) => ({
      ...p,
      userName: p.user.name,
      userJob: p.user.job,
      userEmail: p.user.email,
      userPhoneNumber: p.user.phoneNumber,
      user: undefined,
      aboutMe: p.aboutMe ? JSON.parse(p.aboutMe) : undefined,
    }));
  }

  // 포트폴리오 상세 조회 (Relations 포함)
  async findByIdWithRelations(portfolioId: number): Promise<PortfolioDetailResponseDto | null> {
    const portfolio = await this.model.findUnique({
      where: { portfolioId },
      include: {
        user: {
          include: {
            licenses: true,
          },
        },
        portfolioStacks: {
          include: {
            stack: true,
          },
          orderBy: { rank: 'asc' },
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
            role: true,
            startDate: true,
            endDate: true,
            projectContents: {
              select: {
                content: true,
              },
              take: 1,
            },
            projectStacks: {
              select: {
                stackId: true,
                stackName: true,
              },
            },
            links: {
              where: {
                linkSite: 'github',
              },
              select: {
                url: true,
              },
              take: 1,
            },
          },
        },
      },
    });

    if (!portfolio) return null;

    return {
      portfolioId: portfolio.portfolioId,
      userId: portfolio.userId,
      userName: (portfolio as any).user.name ?? undefined,
      userJob: (portfolio as any).user.job ?? undefined,
      userEmail: (portfolio as any).user.email ?? undefined,
      userPhoneNumber: (portfolio as any).user.phoneNumber ?? undefined,
      title: portfolio.title,
      thumbnail: portfolio.thumbnail ?? undefined,
      coverImage: (portfolio as any).coverImage ?? undefined,
      template: portfolio.template,
      views: portfolio.views,
      likesCount: (portfolio as any).likesCount,
      isPublic: portfolio.isPublic,
      introduction: portfolio.introduction ?? undefined,
      aboutMe: (portfolio as any).aboutMe ? JSON.parse((portfolio as any).aboutMe) : undefined,
      createdAt: portfolio.createdAt,
      updatedAt: portfolio.updatedAt,
      stacks: portfolio.portfolioStacks.map((ps: any) => ({
        stackId: ps.stack.stackId,
        name: ps.stack.name,
        level: ps.stack.level ?? undefined,
        rank: ps.rank,
      })),
      careers: portfolio.portfolioCareers.map((pc: any) => ({
        careerId: pc.career.careerId,
        content: pc.career.content,
        startDate: pc.career.startDate,
        endDate: pc.career.endDate ?? undefined,
        description: pc.description ?? undefined,
      })),
      licenses: (portfolio as any).user.licenses.map((license: any) => ({
        licenseId: license.licenseId,
        name: license.name,
        gotDate: license.gotDate,
        endDate: license.endDate ?? undefined,
      })),
      projects: portfolio.projects.map((project: any) => ({
        projectId: project.projectId,
        title: project.title,
        thumbnail: project.thumbnail ?? undefined,
        role: project.role ?? undefined,
        startDate: project.startDate,
        endDate: project.endDate ?? undefined,
        description: project.projectContents?.[0]?.content ?? undefined,
        stacks: project.projectStacks.map((ps: any) => ({
          stackId: ps.stackId,
          stackName: ps.stackName,
        })),
        githubUrl: project.links?.[0]?.url ?? undefined,
      })),
    };
  }

  // 포트폴리오 ID와 사용자 ID로 조회 (권한 확인용)
  async findByIdAndUserId(portfolioId: number, userId: number): Promise<PortfolioResponseDto | null> {
    return this.model.findFirst({
      where: { 
        portfolioId,
        userId 
      },
      select: {
        portfolioId: true,
        userId: true,
        title: true,
        thumbnail: true,
        coverImage: true,
        template: true,
        views: true,
        likesCount: true,
        isPublic: true,
        introduction: true,
        aboutMe: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  // 추천 포트폴리오 (조회수 기준 상위 10개)
  async findRecommended(): Promise<PortfolioResponseDto[]> {
    const portfolios = await this.model.findMany({
      where: {
        isPublic: 'PUBLIC', // PUBLIC 포트폴리오만
      },
      orderBy: {
        views: 'desc',
      },
      take: 10,
      select: {
        portfolioId: true,
        userId: true,
        title: true,
        thumbnail: true,
        coverImage: true,
        template: true,
        views: true,
        likesCount: true,
        isPublic: true,
        introduction: true,
        aboutMe: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            name: true,
            job: true,
            email: true,
            phoneNumber: true,
          },
        },
      },
    });

    return portfolios.map((p: any) => ({
      ...p,
      userName: p.user.name,
      userJob: p.user.job,
      userEmail: p.user.email,
      userPhoneNumber: p.user.phoneNumber,
      user: undefined,
      aboutMe: p.aboutMe ? JSON.parse(p.aboutMe) : undefined,
    }));
  }

  // 포트폴리오 검색
  async searchPortfolios(
    keyword?: string,
    sort: 'recent' | 'views' = 'recent',
    template?: 'IMAGE' | 'STANDARD',
    isPublic?: 'PUBLIC' | 'PRIVATE' | 'LINK'
  ): Promise<PortfolioResponseDto[]> {
    const portfolios = await this.model.findMany({
      where: {
        AND: [
          keyword
            ? {
                OR: [
                  { title: { contains: keyword } },
                  { greeting: { contains: keyword } },
                  { introduction: { contains: keyword } },
                ],
              }
            : {},
          template ? { template } : {},
          isPublic ? { isPublic } : {},
        ],
      },
      orderBy: sort === 'recent' ? { createdAt: 'desc' } : { views: 'desc' },
      select: {
        portfolioId: true,
        userId: true,
        title: true,
        thumbnail: true,
        coverImage: true,
        template: true,
        views: true,
        likesCount: true,
        isPublic: true,
        introduction: true,
        aboutMe: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            name: true,
            job: true,
            email: true,
            phoneNumber: true,
          },
        },
      },
    });

    return portfolios.map((p: any) => ({
      ...p,
      userName: p.user.name,
      userJob: p.user.job,
      userEmail: p.user.email,
      userPhoneNumber: p.user.phoneNumber,
      user: undefined,
      aboutMe: p.aboutMe ? JSON.parse(p.aboutMe) : undefined,
    }));
  }

  // 조회수 증가
  async incrementViews(portfolioId: number): Promise<void> {
    await this.model.update({
      where: { portfolioId },
      data: {
        views: {
          increment: 1,
        },
      },
    });
  }

  // 포트폴리오 필수 요소 확인
  async checkRequirements(userId: number): Promise<{
    career: boolean;
    stack: boolean;
    project: boolean;
    job: boolean;
  }> {
    // 경력 확인
    const careerCount = await this.prisma.career.count({
      where: { userId },
    });

    // 기술스택 확인
    const stackCount = await this.prisma.stack.count({
      where: { userId },
    });

    // 프로젝트 확인
    const projectCount = await this.prisma.project.count({
      where: { userId },
    });

    // 직군 확인 (User의 job 필드)
    const user = await this.prisma.user.findUnique({
      where: { userId },
      select: { job: true },
    });

    return {
      career: careerCount > 0,
      stack: stackCount > 0,
      project: projectCount > 0,
      job: !!user?.job,
    };
  }

  // 포트폴리오 삭제 (portfolioId로) - Relations도 함께 삭제
  async deletePortfolio(portfolioId: number): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      // 1. PortfolioStack 삭제
      await tx.portfolioStack.deleteMany({
        where: { portfolioId },
      });

      // 2. PortfolioCareer 삭제
      await tx.portfolioCareer.deleteMany({
        where: { portfolioId },
      });

      // 3. Portfolio-Project 연결 해제
      await tx.portfolio.update({
        where: { portfolioId },
        data: {
          projects: {
            set: [], // 모든 연결 제거
          },
        },
      });

      // 4. Portfolio 삭제
      await tx.portfolio.delete({
        where: { portfolioId },
      });
    });
  }
}
