import { ProjectRepository } from './project.repository';
import { z } from 'zod';
import { createProjectSchema, updateProjectSchema } from './project.dto';

export class ProjectService {
  constructor(private readonly repo: ProjectRepository) {}

  async list(userId: number) {
    return this.repo.findAllByUser(userId);
  }

  async detail(projectId: number, userId?: number) {
    return this.repo.findById(projectId, userId);
  }

  async create(userId: number, body: unknown) {
    const data = createProjectSchema.parse(body);

    return this.repo.create({
      user: { connect: { userId } },
      title: data.title,
      startDate: data.startDate,
      endDate: data.endDate ?? null,
      role: data.role ?? null,
      thumbnail: data.thumbnail ?? null,
      // 하위 리소스는 createMany로 일괄 생성
      projectTags: data.tags?.length
        ? { createMany: { data: data.tags.map((t) => ({ userId, content: t })) } }
        : undefined,
      projectStacks: data.stacks?.length
        ? { createMany: { data: data.stacks.map((s) => ({ userId, stackId: s.stackId, stackName: s.stackName })) } }
        : undefined,
      projectContents: data.contents?.length
        ? { createMany: { data: data.contents.map((c) => ({ userId, title: c.title, content: c.content })) } }
        : undefined,
      projectImages: data.images?.length
        ? { createMany: { data: data.images.map((u) => ({ userId, imageURL: u })) } }
        : undefined,
      links: data.links?.length
        ? { createMany: { data: data.links.map((l) => ({ userId, name: l.name, url: l.url, linkSite: l.linkSite })) } }
        : undefined,
    });
  }

  async update(userId: number, projectId: number, body: unknown) {
    const data = updateProjectSchema.parse(body);

    // 간단 업데이트: 기본 필드만 업데이트 (하위 리소스는 별도 엔드포인트가 이상적)
    // 필요시 여기서 기존 하위 리소스 삭제/재생성 트랜잭션으로 확장 가능
    return this.repo.update(projectId, userId, {
      title: data.title,
      startDate: data.startDate,
      endDate: data.endDate ?? undefined,
      role: data.role ?? undefined,
      thumbnail: data.thumbnail ?? undefined,
    });
  }

  async remove(userId: number, projectId: number) {
    await this.repo.delete(projectId, userId);
  }
}
