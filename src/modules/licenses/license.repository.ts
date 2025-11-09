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
}
