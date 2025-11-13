// src/common/base.repository.ts
import { PrismaClient } from "@prisma/client";

export abstract class CommonRepository<T> {
  protected prisma: PrismaClient;
  protected model: any;

  constructor(prisma: PrismaClient, model: any) {
    this.prisma = prisma;
    this.model = model;
  }

  async findAll(): Promise<T[]> {
    return this.model.findMany();
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findUnique({ where: { id } });
  }

  async create(data: Partial<T>): Promise<T> {
    return this.model.create({ data });
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    return this.model.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await this.model.delete({ where: { id } });
  }
}
