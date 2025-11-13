import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { CareerRepository } from './career.repository';
import { CareerService } from './career.service';
import { CareerController } from './career.controller';

const repo = new CareerRepository();
const service = new CareerService(repo);
const controller = new CareerController(service);

export const careerRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     CareerRequest:
 *       type: object
 *       required:
 *         - content
 *         - startDate
 *       properties:
 *         content:
 *           type: string
 *           description: 경력 내용
 *         startDate:
 *           type: string
 *           format: date-time
 *           description: 시작일
 *         endDate:
 *           type: string
 *           format: date-time
 *           description: 종료일 (선택)
 *     CareerResponse:
 *       type: object
 *       properties:
 *         careerId:
 *           type: number
 *         userId:
 *           type: number
 *         content:
 *           type: string
 *         startDate:
 *           type: string
 *           format: date-time
 *         endDate:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/careers:
 *   get:
 *     summary: 경력 목록 조회
 *     tags: [Career]
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
 *                     $ref: '#/components/schemas/CareerResponse'
 */
careerRouter.get('/careers', authenticate, controller.list);

/**
 * @swagger
 * /api/careers:
 *   post:
 *     summary: 경력 등록
 *     tags: [Career]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CareerRequest'
 *     responses:
 *       201:
 *         description: 등록 성공
 *       401:
 *         description: 인증 필요
 */
careerRouter.post('/careers', authenticate, controller.create);

/**
 * @swagger
 * /api/careers/{careerId}:
 *   patch:
 *     summary: 경력 수정
 *     tags: [Career]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: careerId
 *         required: true
 *         schema:
 *           type: number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CareerRequest'
 *     responses:
 *       200:
 *         description: 수정 성공
 */
careerRouter.patch('/careers/:careerId', authenticate, controller.update);

/**
 * @swagger
 * /api/careers/{careerId}:
 *   delete:
 *     summary: 경력 삭제
 *     tags: [Career]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: careerId
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: 삭제 성공
 */
careerRouter.delete('/careers/:careerId', authenticate, controller.remove);

/**
 * @swagger
 * /api/careers/{careerId}:
 *   get:
 *     summary: 경력 상세 조회
 *     tags: [Career]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: careerId
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: 조회 성공
 *       404:
 *         description: 경력을 찾을 수 없음
 */
careerRouter.get('/careers/:careerId', authenticate, controller.detail);
