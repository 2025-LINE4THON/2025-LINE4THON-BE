import { Request, Response } from 'express';
import { StackService } from './stack.service';
import { successResponse, createdResponse, errorResponse } from '../../common/common.response';

export class StackController {
  constructor(private readonly service: StackService) {}

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
      const stackId = Number(req.params.stackId);
      const data = await this.service.detail(stackId, userId);
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
      const stackId = Number(req.params.stackId);
      const updated = await this.service.update(userId, stackId, req.body);
      return successResponse(res, updated, 200, 'Updated');
    } catch (e: any) {
      return errorResponse(res, e.message, e.statusCode ?? 400);
    }
  };

  remove = async (req: Request, res: Response) => {
    try {
      const userId = req.user!.userId;
      const stackId = Number(req.params.stackId);
      await this.service.remove(userId, stackId);
      return successResponse(res, null, 200, 'Deleted');
    } catch (e: any) {
      return errorResponse(res, e.message, e.statusCode ?? 400);
    }
  };
}
