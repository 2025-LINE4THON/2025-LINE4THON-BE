import { prisma } from '../../config/database';
import { AppError } from '../../middleware/errorHandler';

/**
 * 공통 CRUD 유틸리티 함수
 * Prisma 모델을 기반으로 재사용 가능한 CRUD 작업을 제공합니다.
 */

interface PaginationParams {
  page?: number;
  limit?: number;
}

interface PaginationResult<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * 단일 레코드 조회
 */
export async function findOne<T>(
  model: any,
  id: number | string,
  include?: object,
  errorMessage: string = '데이터를 찾을 수 없습니다.',
): Promise<T> {
  const data = await model.findUnique({
    where: { [getIdField(model)]: id },
    ...(include && { include }),
  });

  if (!data) {
    throw new AppError(errorMessage, 404);
  }

  return data as T;
}

/**
 * 여러 레코드 조회 (필터링, 정렬)
 */
export async function findMany<T>(
  model: any,
  options: {
    where?: object;
    include?: object;
    orderBy?: object;
    skip?: number;
    take?: number;
  } = {},
): Promise<T[]> {
  const data = await model.findMany(options);
  return data as T[];
}

/**
 * 페이지네이션을 포함한 레코드 조회
 */
export async function findManyWithPagination<T>(
  model: any,
  params: PaginationParams & {
    where?: object;
    include?: object;
    orderBy?: object;
  },
): Promise<PaginationResult<T>> {
  const { page = 1, limit = 10, where, include, orderBy } = params;
  const skip = (page - 1) * limit;

  const [data, totalItems] = await Promise.all([
    model.findMany({
      where,
      include,
      orderBy,
      skip,
      take: limit,
    }),
    model.count({ where }),
  ]);

  const totalPages = Math.ceil(totalItems / limit);

  return {
    data: data as T[],
    pagination: {
      currentPage: page,
      totalPages,
      totalItems,
      itemsPerPage: limit,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

/**
 * 레코드 생성
 */
export async function createOne<T>(
  model: any,
  data: object,
  include?: object,
): Promise<T> {
  const created = await model.create({
    data,
    ...(include && { include }),
  });

  return created as T;
}

/**
 * 레코드 업데이트
 */
export async function updateOne<T>(
  model: any,
  id: number | string,
  data: object,
  include?: object,
  errorMessage: string = '업데이트할 데이터를 찾을 수 없습니다.',
): Promise<T> {
  // 먼저 데이터 존재 여부 확인
  await findOne(model, id, undefined, errorMessage);

  const updated = await model.update({
    where: { [getIdField(model)]: id },
    data,
    ...(include && { include }),
  });

  return updated as T;
}

/**
 * 레코드 삭제 (Soft Delete)
 */
export async function softDelete<T>(
  model: any,
  id: number | string,
  errorMessage: string = '삭제할 데이터를 찾을 수 없습니다.',
): Promise<T> {
  // deletedAt 필드가 있는 모델에서 사용
  return updateOne<T>(
    model,
    id,
    { deletedAt: new Date() },
    undefined,
    errorMessage,
  );
}

/**
 * 레코드 삭제 (Hard Delete)
 */
export async function deleteOne<T>(
  model: any,
  id: number | string,
  errorMessage: string = '삭제할 데이터를 찾을 수 없습니다.',
): Promise<T> {
  // 먼저 데이터 존재 여부 확인
  await findOne(model, id, undefined, errorMessage);

  const deleted = await model.delete({
    where: { [getIdField(model)]: id },
  });

  return deleted as T;
}

/**
 * 레코드 존재 여부 확인
 */
export async function exists(
  model: any,
  where: object,
): Promise<boolean> {
  const count = await model.count({ where });
  return count > 0;
}

/**
 * 레코드 개수 조회
 */
export async function count(
  model: any,
  where?: object,
): Promise<number> {
  return model.count({ where });
}

/**
 * 조건에 맞는 첫 번째 레코드 조회
 */
export async function findFirst<T>(
  model: any,
  options: {
    where?: object;
    include?: object;
    orderBy?: object;
  },
): Promise<T | null> {
  const data = await model.findFirst(options);
  return data as T | null;
}

/**
 * 여러 레코드 생성
 */
export async function createMany<T>(
  model: any,
  data: object[],
): Promise<{ count: number }> {
  return model.createMany({ data });
}

/**
 * 여러 레코드 삭제
 */
export async function deleteMany(
  model: any,
  where: object,
): Promise<{ count: number }> {
  return model.deleteMany({ where });
}

/**
 * Upsert (있으면 업데이트, 없으면 생성)
 */
export async function upsertOne<T>(
  model: any,
  where: object,
  create: object,
  update: object,
): Promise<T> {
  const data = await model.upsert({
    where,
    create,
    update,
  });

  return data as T;
}

/**
 * 모델의 ID 필드명 가져오기
 * Prisma 모델에 따라 userId, projectId 등 다양할 수 있음
 */
function getIdField(model: any): string {
  // Prisma 모델 메타데이터에서 ID 필드를 찾습니다
  const modelName = model.name || model._baseDmmf?.modelMap?.name;
  
  // 일반적인 ID 필드명 패턴
  const commonIdFields = [
    `${modelName?.toLowerCase()}Id`,
    'id',
    'userId',
    'projectId',
    'portfolioId',
  ];

  // 실제로는 Prisma 스키마에 맞게 조정 필요
  return commonIdFields[0] || 'id';
}
