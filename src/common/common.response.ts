import { Response } from 'express';

interface SuccessResponse<T> {
  status: 'success';
  data: T;
  message?: string;
}

export const successResponse = <T>(
  res: Response,
  data: T,
  statusCode: number = 200,
  message?: string,
): Response<SuccessResponse<T>> => {
  return res.status(statusCode).json({
    status: 'success',
    data,
    ...(message && { message }),
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
  message?: string,
): Response<SuccessResponse<T>> => {
  return successResponse(res, data, 201, message);
};
