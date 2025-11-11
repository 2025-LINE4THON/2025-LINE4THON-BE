import { Request, Response } from 'express';
import { LicenseService } from './license.service';
import { successResponse, createdResponse, errorResponse } from '../../common/common.response';

export class LicenseController {
  constructor(private readonly service: LicenseService) {}

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
      const licenseId = Number(req.params.licenseId);
      const data = await this.service.detail(licenseId, userId);
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
      const licenseId = Number(req.params.licenseId);
      const updated = await this.service.update(userId, licenseId, req.body);
      return successResponse(res, updated, 200, 'Updated');
    } catch (e: any) {
      return errorResponse(res, e.message, e.statusCode ?? 400);
    }
  };

  remove = async (req: Request, res: Response) => {
    try {
      const userId = req.user!.userId;
      const licenseId = Number(req.params.licenseId);
      await this.service.remove(userId, licenseId);
      return successResponse(res, null, 200, 'Deleted');
    } catch (e: any) {
      return errorResponse(res, e.message, e.statusCode ?? 400);
    }
  };
}
