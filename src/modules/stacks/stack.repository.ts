import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database';

export class StackRepository {
  private model = prisma.stack;

  async findById(stackId: number) {
    return this.model.findUnique({
      where: { stackId },
      include: {
        portfolioStacks: true,
      },
    });
  }

  async findAllByUser(userId: number) {
    return this.model.findMany({
      where: { userId },
      orderBy: { stackId: 'desc' },
    });
  }

  async create(data: Prisma.StackCreateInput) {
    return this.model.create({ data });
  }

  async update(stackId: number, data: Prisma.StackUpdateInput) {
    return this.model.update({ where: { stackId }, data });
  }

  async delete(stackId: number) {
    return this.model.delete({ where: { stackId } });
  }

  async isOwner(stackId: number, userId: number) {
    const s = await this.model.findUnique({
      where: { stackId },
      select: { userId: true },
    });
    return !!s && s.userId === userId;
  }

  // FK(PortfolioStack, ProjectStack) 참조 끊기
  async detachRelations(stackId: number) {
    await prisma.portfolioStack.deleteMany({ where: { stackId } });
    await prisma.projectStack.deleteMany({ where: { stackId } });
  }

  // 같은 유저 내 중복 이름 방지(선택)
  async existsByName(userId: number, name: string) {
    const found = await this.model.findFirst({ where: { userId, name } });
    return !!found;
  }
}
