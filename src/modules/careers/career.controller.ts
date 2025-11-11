import { Request, Response } from 'express';
import { CareerService } from './career.service';
import { successResponse, createdResponse, errorResponse } from '../../common/common.response';

export class CareerController {
  constructor(private readonly service: CareerService) {}

  list = async (req: Request, res: Response) => {
    try {
      const userId = req.user!.userId;
      const data = await this.service.list(userId);
      return successResponse(res, data);
    } catch (e: any) {
      return errorResponse(res, e.message, e.statusCode ?? 400);
    }
  };

  detail = async (req: Request, res: Response) => {
    try {
      const userId = req.user!.userId;
      const careerId = Number(req.params.careerId);
      const data = await this.service.detail(careerId, userId);
      return successResponse(res, data);
    } catch (e: any) {
      return errorResponse(res, e.message, e.statusCode ?? 400);
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const userId = req.user!.userId;
      const created = await this.service.create(userId, req.body);
      return createdResponse(res, created, 'Created');
    } catch (e: any) {
      return errorResponse(res, e.message, e.statusCode ?? 400);
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const userId = req.user!.userId;
      const careerId = Number(req.params.careerId);
      const updated = await this.service.update(userId, careerId, req.body);
      return successResponse(res, updated, 200, 'Updated');
    } catch (e: any) {
      return errorResponse(res, e.message, e.statusCode ?? 400);
    }
  };

  remove = async (req: Request, res: Response) => {
    try {
      const userId = req.user!.userId;
      const careerId = Number(req.params.careerId);
      await this.service.remove(userId, careerId);
      return successResponse(res, null, 200, 'Deleted');
    } catch (e: any) {
      return errorResponse(res, e.message, e.statusCode ?? 400);
    }
  };
}
