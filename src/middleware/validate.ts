import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { AppError } from './errorHandler';

/**
 * Zod 스키마를 사용한 요청 검증 미들웨어
 */
export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // 요청 body 검증
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Zod 에러를 사용자 친화적인 메시지로 변환
        const errorMessages = error.issues.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        
        throw new AppError(
          `검증 실패: ${errorMessages.map((e) => e.message).join(', ')}`,
          400
        );
      }
      next(error);
    }
  };
};
