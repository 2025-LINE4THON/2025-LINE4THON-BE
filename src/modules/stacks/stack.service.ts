import { StackRepository } from './stack.repository';
import { createStackSchema, updateStackSchema } from './stack.dto';
import { AppError } from '../../middleware/errorHandler';

export class StackService {
  constructor(private readonly repo: StackRepository) {}

  async list(userId: number) {
    return this.repo.findAllByUser(userId);
  }

  async detail(stackId: number, userId: number) {
    const data = await this.repo.findById(stackId);
    if (!data) throw new AppError('Not Found', 404);
    if (data.userId !== userId) throw new AppError('권한이 없습니다.', 403);
    return data;
  }

  async create(userId: number, body: unknown) {
    const { stacks } = createStackSchema.parse(body);
    return this.repo.bulkUpdate(userId, stacks);
  }

  async update(userId: number, stackId: number, body: unknown) {
    const ok = await this.repo.isOwner(stackId, userId);
    if (!ok) throw new AppError('권한이 없습니다.', 403);

    const data = updateStackSchema.parse(body);

    // (선택) 이름을 바꿀 때 중복 체크
    if (data.name) {
      const exists = await this.repo.existsByName(userId, data.name);
      // 자기 자신과 동일한 이름으로 바꾸는 경우는 허용하려면 여기서 추가 체크 가능
      if (exists) throw new AppError('이미 존재하는 스택 이름입니다.', 400);
    }

    return this.repo.update(stackId, {
      name: data.name ?? undefined,
      level: data.level ?? undefined,
    });
  }

  async remove(userId: number, stackId: number) {
    const ok = await this.repo.isOwner(stackId, userId);
    if (!ok) throw new AppError('권한이 없습니다.', 403);

    // FK 연결 해제 후 삭제 (ProjectStack/PortfolioStack 참조)
    await this.repo.detachRelations(stackId);
    await this.repo.delete(stackId);
  }
}
