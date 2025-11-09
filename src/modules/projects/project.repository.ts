import { Prisma, Project } from '@prisma/client';
import { prisma } from '../../config/database';

export class ProjectRepository {
  private model = prisma.project;

  async findAllByUser(userId: number) {
    return this.model.findMany({
      where: { userId },
      orderBy: { projectId: 'desc' },
      include: {
        projectTags: true,
        projectStacks: true,
        projectContents: true,
        projectImages: true,
        links: true,
      },
    });
  }

  async findById(projectId: number, userId?: number) {
    return this.model.findUnique({
      where: { projectId },
      include: {
        projectTags: true,
        projectStacks: true,
        projectContents: true,
        projectImages: true,
        links: true,
      },
    }).then((p) => (userId ? (p && p.userId === userId ? p : null) : p));
  }

  async create(data: Prisma.ProjectCreateInput & { 
    projectTags?: { createMany?: { data: { userId: number; content: string }[] } },
    projectStacks?: { createMany?: { data: { userId: number; stackId: number; stackName: string }[] } },
    projectContents?: { createMany?: { data: { userId: number; title: string; content: string }[] } },
    projectImages?: { createMany?: { data: { userId: number; imageURL: string }[] } },
    links?: { createMany?: { data: { userId: number; name: string; url: string; linkSite?: string | null }[] } },
  }) {
    return this.model.create({ data });
  }

  async update(projectId: number, userId: number, data: Prisma.ProjectUpdateInput) {
    // 소유권 체크를 위해 where에 복합 조건 사용
    return this.model.update({
      where: { projectId },
      data,
    }).then(async (p) => {
      if (p.userId !== userId) {
        // 원자적 체크가 필요하면 트랜잭션/미들웨어로 보완 가능
        throw new Error('권한이 없습니다.');
      }
      return p;
    });
  }

  async delete(projectId: number, userId: number) {
    // 소유권 검증
    const existing = await this.model.findUnique({ where: { projectId }, select: { userId: true } });
    if (!existing) throw new Error('존재하지 않는 프로젝트입니다.');
    if (existing.userId !== userId) throw new Error('권한이 없습니다.');
    await this.model.delete({ where: { projectId } });
  }
}
