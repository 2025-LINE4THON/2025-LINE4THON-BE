/**
 * Author @곽도윤
 * 
 * 서비스 계층에서 공통으로 사용될 CRUD 메서드 정의, 추상 클래스
 * 
 * 사용예시 :
 * import { CommonService } from "../../common/common.serviece";
import { prisma } from "../../config/db";

export class UserService extends CommonService<any> {
  async create(data) {
    // 도메인 전용 로직 추가 가능
    data.password = await bcrypt.hash(data.password, 10);
    return prisma.user.create({ data });
  }

  async findById(id) {
    return prisma.user.findUnique({ where: { id } });
  }

  async update(id, data) {
    return prisma.user.update({ where: { id }, data });
  }

  async delete(id) {
    await prisma.user.delete({ where: { id } });
  }
}
 */

import { CommonRepository } from "./common.repository";


export abstract class CommonService<T> {
  protected repository: CommonRepository<T>;

  constructor(repository: CommonRepository<T>) {
    this.repository = repository;
  }

  async getAll(): Promise<T[]> {
    return this.repository.findAll();
  }

  async getById(id: string): Promise<T | null> {
    return this.repository.findById(id);
  }

  async create(data: Partial<T>): Promise<T> {
    return this.repository.create(data);
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    return this.repository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}