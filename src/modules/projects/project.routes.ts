import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { ProjectRepository } from './project.repository';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';

const repo = new ProjectRepository();
const service = new ProjectService(repo);
const controller = new ProjectController(service);

export const projectRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     ProjectRequest:
 *       type: object
 *       required:
 *         - title
 *         - startDate
 *       properties:
 *         title:
 *           type: string
 *           description: 프로젝트 제목
 *         startDate:
 *           type: string
 *           format: date-time
 *           description: 시작일
 *         endDate:
 *           type: string
 *           format: date-time
 *           description: 종료일 (선택)
 *         role:
 *           type: string
 *           description: 역할 (선택)
 *         thumbnail:
 *           type: string
 *           description: 썸네일 URL (선택)
 *     ProjectResponse:
 *       type: object
 *       properties:
 *         projectId:
 *           type: number
 *         userId:
 *           type: number
 *         title:
 *           type: string
 *         startDate:
 *           type: string
 *           format: date-time
 *         endDate:
 *           type: string
 *           format: date-time
 *         role:
 *           type: string
 *         thumbnail:
 *           type: string
 */

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: 프로젝트 목록 조회
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ProjectResponse'
 */
projectRouter.get('/projects', authenticate, controller.list);

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: 프로젝트 생성
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProjectRequest'
 *     responses:
 *       201:
 *         description: 생성 성공
 */
projectRouter.post('/projects', authenticate, controller.create);

/**
 * @swagger
 * /api/project/{projectID}:
 *   get:
 *     summary: 프로젝트 상세 조회 (요구 사양 경로)
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectID
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: 조회 성공
 *       404:
 *         description: 프로젝트를 찾을 수 없음
 */
projectRouter.get('/project/:projectID', authenticate, controller.detail);

/**
 * @swagger
 * /api/projects/{projectId}:
 *   get:
 *     summary: 프로젝트 상세 조회 (일관된 경로)
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: 조회 성공
 */
projectRouter.get('/projects/:projectId', authenticate, controller.detail);

/**
 * @swagger
 * /api/projects/{projectId}:
 *   patch:
 *     summary: 프로젝트 수정
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProjectRequest'
 *     responses:
 *       200:
 *         description: 수정 성공
 */
projectRouter.patch('/projects/:projectId', authenticate, controller.update);

/**
 * @swagger
 * /api/project/{projectID}:
 *   delete:
 *     summary: 프로젝트 삭제 (요구 사양 경로)
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectID
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: 삭제 성공
 */
projectRouter.delete('/project/:projectID', authenticate, controller.remove);

/**
 * @swagger
 * /api/projects/{projectId}:
 *   delete:
 *     summary: 프로젝트 삭제 (일관된 경로)
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: 삭제 성공
 */
projectRouter.delete('/projects/:projectId', authenticate, controller.remove);
