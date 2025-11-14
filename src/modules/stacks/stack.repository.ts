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

  // FK(PortfolioStack) 참조 끊기
  async detachRelations(stackId: number) {
    await prisma.portfolioStack.deleteMany({ where: { stackId } });
    // ProjectStack은 더 이상 stackId를 사용하지 않음
  }

  // 같은 유저 내 중복 이름 방지(선택)
  async existsByName(userId: number, name: string) {
    const found = await this.model.findFirst({ where: { userId, name } });
    return !!found;
  }

  // 기존 스택 모두 삭제 후 새로 생성 (배열 일괄 처리)
  async bulkUpdate(userId: number, stacks: Array<{ name: string; level?: string | null }>) {
    // 1. 기존 스택 모두 삭제
    await this.model.deleteMany({ where: { userId } });

    // 2. 새로운 스택 일괄 생성
    if (stacks.length > 0) {
      await this.model.createMany({
        data: stacks.map(s => ({
          userId,
          name: s.name,
          level: s.level ?? null,
        })),
      });
    }

    // 3. 생성된 스택 목록 반환
    return this.findAllByUser(userId);
  }
}
