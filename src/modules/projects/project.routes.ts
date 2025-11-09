import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { ProjectRepository } from './project.repository';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';

const repo = new ProjectRepository();
const service = new ProjectService(repo);
const controller = new ProjectController(service);

export const projectRouter = Router();

// 목록 (선택) — /api/projects GET
projectRouter.get('/projects', authenticate, controller.list);

// 생성 — POST /api/projects
projectRouter.post('/projects', authenticate, controller.create);

// 상세 — GET /api/project/:projectID (요구 사양), /api/projects/:projectId (일관 경로)
projectRouter.get('/project/:projectID', authenticate, controller.detail);
projectRouter.get('/projects/:projectId', authenticate, controller.detail);

// 수정 — PATCH /api/projects/:projectId
projectRouter.patch('/projects/:projectId', authenticate, controller.update);

// 삭제 — DELETE /api/project/:projectID (요구 사양), /api/projects/:projectId (일관 경로)
projectRouter.delete('/project/:projectID', authenticate, controller.remove);
projectRouter.delete('/projects/:projectId', authenticate, controller.remove);
