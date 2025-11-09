import { CareerRepository } from './career.repository';
import { createCareerSchema, updateCareerSchema } from './career.dto';
import { AppError } from '../../middleware/errorHandler';

export class CareerService {
  constructor(private readonly repo: CareerRepository) {}

  async list(userId: number) {
    return this.repo.findAllByUser(userId);
  }

  async detail(careerId: number, userId: number) {
    const data = await this.repo.findById(careerId);
    if (!data) throw new AppError('Not Found', 404);
    if (data.userId !== userId) throw new AppError('권한이 없습니다.', 403);
    return data;
  }

  async create(userId: number, body: unknown) {
    const data = createCareerSchema.parse(body);
    return this.repo.create({
      user: { connect: { userId } },
      content: data.content,
      startDate: data.startDate,
      endDate: data.endDate ?? null,
    });
  }

  async update(userId: number, careerId: number, body: unknown) {
    const ok = await this.repo.isOwner(careerId, userId);
    if (!ok) throw new AppError('권한이 없습니다.', 403);

    const data = updateCareerSchema.parse(body);
    return this.repo.update(careerId, {
      content: data.content ?? undefined,
      startDate: data.startDate ?? undefined,
      endDate: data.endDate ?? undefined,
    });
  }

  async remove(userId: number, careerId: number) {
    const ok = await this.repo.isOwner(careerId, userId);
    if (!ok) throw new AppError('권한이 없습니다.', 403);

    // FK 제약(PortfolioCareer) 제거 후 삭제
    await this.repo.detachRelations(careerId);
    await this.repo.delete(careerId);
  }
}
