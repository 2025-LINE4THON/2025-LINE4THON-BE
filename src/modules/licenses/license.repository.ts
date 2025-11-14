import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database';

export class LicenseRepository {
  private model = prisma.license;

  async findById(licenseId: number) {
    return this.model.findUnique({ where: { licenseId } });
  }

  async findAllByUser(userId: number) {
    return this.model.findMany({
      where: { userId },
      orderBy: { licenseId: 'desc' },
    });
  }

  async create(data: Prisma.LicenseCreateInput) {
    return this.model.create({ data });
  }

  async update(licenseId: number, data: Prisma.LicenseUpdateInput) {
    return this.model.update({ where: { licenseId }, data });
  }

  async delete(licenseId: number) {
    return this.model.delete({ where: { licenseId } });
  }

  async isOwner(licenseId: number, userId: number) {
    const l = await this.model.findUnique({
      where: { licenseId },
      select: { userId: true },
    });
    return !!l && l.userId === userId;
  }

  // 기존 자격증 모두 삭제 후 새로 생성 (배열 일괄 처리)
  async bulkUpdate(userId: number, licenses: Array<{ name: string; gotDate: Date; endDate?: Date | null }>) {
    // 1. 기존 자격증 모두 삭제
    await this.model.deleteMany({ where: { userId } });

    // 2. 새로운 자격증 일괄 생성
    if (licenses.length > 0) {
      await this.model.createMany({
        data: licenses.map(l => ({
          userId,
          name: l.name,
          gotDate: l.gotDate,
          endDate: l.endDate ?? null,
        })),
      });
    }

    // 3. 생성된 자격증 목록 반환
    return this.findAllByUser(userId);
  }
}
