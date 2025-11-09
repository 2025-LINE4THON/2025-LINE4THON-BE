import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { LicenseRepository } from './license.repository';
import { LicenseService } from './license.service';
import { LicenseController } from './license.controller';

const repo = new LicenseRepository();
const service = new LicenseService(repo);
const controller = new LicenseController(service);

export const licenseRouter = Router();

// (선택) 목록
licenseRouter.get('/licenses', authenticate, controller.list);

// 3.3. 자격증 등록
licenseRouter.post('/licenses', authenticate, controller.create);

// 3.3.1. 자격증 수정
licenseRouter.patch('/licenses/:licenseId', authenticate, controller.update);

// 3.3.2. 자격증 삭제
licenseRouter.delete('/licenses/:licenseId', authenticate, controller.remove);

// 3.3.3. 자격증 조회
licenseRouter.get('/licenses/:licenseId', authenticate, controller.detail);
