import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AppError } from './errorHandler';

interface JwtPayload {
  userId: number;
  username: string;
}

// Request 타입 확장
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Authorization 헤더에서 토큰 가져오기 (프론트에서 localStorage의 토큰을 헤더에 담아 전송)
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : null;

    if (!token) {
      throw new AppError('인증 토큰이 필요합니다.', 401);
    }

    // 토큰 검증
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    
    // 요청 객체에 사용자 정보 추가
    req.user = decoded;
    
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError('유효하지 않은 토큰입니다.', 401));
    } else if (error instanceof jwt.TokenExpiredError) {
      next(new AppError('토큰이 만료되었습니다.', 401));
    } else {
      next(error);
    }
  }
};

// 선택적 인증 미들웨어 (토큰이 있으면 검증, 없으면 통과)
export const optionalAuthenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Authorization 헤더에서 토큰 가져오기
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : null;

    // 토큰이 없으면 그냥 통과
    if (!token) {
      return next();
    }

    // 토큰이 있으면 검증
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    req.user = decoded;
    
    next();
  } catch (error) {
    // 토큰이 유효하지 않아도 그냥 통과 (선택적)
    next();
  }
};
