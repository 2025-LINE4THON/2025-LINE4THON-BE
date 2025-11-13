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
      console.log('Validating request body:', JSON.stringify(req.body, null, 2));
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Zod 에러를 사용자 친화적인 메시지로 변환
        console.log('Zod validation error:', JSON.stringify(error.issues, null, 2));
        const errorMessages = error.issues.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        
        throw new AppError(
          `검증 실패: ${errorMessages.map((e) => `${e.field}: ${e.message}`).join(', ')}`,
          400
        );
      }
      next(error);
    }
  };
};
