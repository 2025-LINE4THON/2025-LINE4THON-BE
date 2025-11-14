import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database';

export class CareerRepository {
  private model = prisma.career;

  async findById(careerId: number) {
    return this.model.findUnique({
      where: { careerId },
      include: {
        portfolioCareers: true, // 참조 관계 확인용(필요 시 제거 가능)
      },
    });
  }

  async findAllByUser(userId: number) {
    return this.model.findMany({
      where: { userId },
      orderBy: { careerId: 'desc' },
    });
  }

  async create(data: Prisma.CareerCreateInput) {
    return this.model.create({ data });
  }

  async update(careerId: number, data: Prisma.CareerUpdateInput) {
    return this.model.update({
      where: { careerId },
      data,
    });
  }

  async delete(careerId: number) {
    return this.model.delete({
      where: { careerId },
    });
  }

  // 소유권 체크용
  async isOwner(careerId: number, userId: number) {
    const c = await this.model.findUnique({
      where: { careerId },
      select: { userId: true },
    });
    return !!c && c.userId === userId;
  }

  // FK 충돌 방지: PortfolioCareer 먼저 제거
  async detachRelations(careerId: number) {
    await prisma.portfolioCareer.deleteMany({
      where: { careerId },
    });
  }

  // 기존 경력 모두 삭제 후 새로 생성 (배열 일괄 처리)
  async bulkUpdate(userId: number, careers: Array<{ content: string; startDate: Date; endDate?: Date | null }>) {
    // 1. 기존 경력 모두 삭제
    await this.model.deleteMany({ where: { userId } });

    // 2. 새로운 경력 일괄 생성
    if (careers.length > 0) {
      await this.model.createMany({
        data: careers.map(c => ({
          userId,
          content: c.content,
          startDate: c.startDate,
          endDate: c.endDate ?? null,
        })),
      });
    }

    // 3. 생성된 경력 목록 반환
    return this.findAllByUser(userId);
  }
}
