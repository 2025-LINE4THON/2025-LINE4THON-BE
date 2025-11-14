import { Response } from 'express';

interface SuccessResponse<T> {
  message: string;
  data: T;
  statusCode: number;
}

interface ErrorResponse {
  status: 'error';
  message: string;
  error?: any;
}

// CommonController에서 사용하는 간단한 버전
export const success = <T>(data: T, message: string = '성공', statusCode: number = 200) => ({
  message,
  data,
  statusCode,
});

export const fail = (message: string, error?: any) => ({
  status: 'error' as const,
  message,
  ...(error && { error }),
});

// 기존 함수들 (명시적 응답용)
export const successResponse = <T>(
  res: Response,
  data: T,
  statusCode: number = 200,
  message: string = '성공',
): Response<SuccessResponse<T>> => {
  return res.status(statusCode).json({
    message,
    data,
    statusCode,
  });
};

export const errorResponse = (
  res: Response,
  message: string,
  statusCode: number = 500,
  error?: any,
): Response => {
  return res.status(statusCode).json({
    status: 'error',
    message,
    ...(error && { error }),
  });
};

export const createdResponse = <T>(
  res: Response,
  data: T,
  message: string = '생성 성공',
): Response<SuccessResponse<T>> => {
  return successResponse(res, data, 201, message);
};

