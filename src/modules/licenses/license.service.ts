import { LicenseRepository } from './license.repository';
import { createLicenseSchema, updateLicenseSchema } from './license.dto';
import { AppError } from '../../middleware/errorHandler';

export class LicenseService {
  constructor(private readonly repo: LicenseRepository) {}

  async list(userId: number) {
    return this.repo.findAllByUser(userId);
  }

  async detail(licenseId: number, userId: number) {
    const data = await this.repo.findById(licenseId);
    if (!data) throw new AppError('Not Found', 404);
    if (data.userId !== userId) throw new AppError('권한이 없습니다.', 403);
    return data;
  }

  async create(userId: number, body: unknown) {
    const { licenses } = createLicenseSchema.parse(body);
    return this.repo.bulkUpdate(userId, licenses);
  }

  async update(userId: number, licenseId: number, body: unknown) {
    const ok = await this.repo.isOwner(licenseId, userId);
    if (!ok) throw new AppError('권한이 없습니다.', 403);

    const data = updateLicenseSchema.parse(body);
    return this.repo.update(licenseId, {
      name: data.name ?? undefined,
      gotDate: data.gotDate ?? undefined,
      endDate: data.endDate ?? undefined,
    });
  }

  async remove(userId: number, licenseId: number) {
    const ok = await this.repo.isOwner(licenseId, userId);
    if (!ok) throw new AppError('권한이 없습니다.', 403);
    await this.repo.delete(licenseId);
  }
}
