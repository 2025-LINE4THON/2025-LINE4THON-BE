import { Request, Response } from 'express';
import { ProjectService } from './project.service';
import { successResponse, createdResponse, errorResponse } from '../../common/common.response';

export class ProjectController {
  constructor(private readonly service: ProjectService) {}

  list = async (req: Request, res: Response) => {
    try {
      const userId = req.user!.userId;
      const data = await this.service.list(userId);
      return successResponse(res, data);
    } catch (e: any) {
      return errorResponse(res, e.message, 400);
    }
  };

  detail = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId; // 공개 상세면 userId 없을 수도 있게 허용하려면 이 라인 유지
      const projectId = Number(req.params.projectId ?? req.params.projectID);
      const data = await this.service.detail(projectId, userId);
      if (!data) return errorResponse(res, 'Not Found', 404);
      return successResponse(res, data);
    } catch (e: any) {
      return errorResponse(res, e.message, 400);
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const userId = req.user!.userId;
      const created = await this.service.create(userId, req.body);
      return createdResponse(res, created, 'Created');
    } catch (e: any) {
      return errorResponse(res, e.message, 400);
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const userId = req.user!.userId;
      const projectId = Number(req.params.projectId ?? req.params.projectID);
      const updated = await this.service.update(userId, projectId, req.body);
      return successResponse(res, updated, 200, 'Updated');
    } catch (e: any) {
      return errorResponse(res, e.message, 400);
    }
  };

  remove = async (req: Request, res: Response) => {
    try {
      const userId = req.user!.userId;
      const projectId = Number(req.params.projectId ?? req.params.projectID);
      await this.service.remove(userId, projectId);
      return successResponse(res, null, 200, 'Deleted');
    } catch (e: any) {
      return errorResponse(res, e.message, 400);
    }
  };
}
