import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { StackRepository } from './stack.repository';
import { StackService } from './stack.service';
import { StackController } from './stack.controller';

const repo = new StackRepository();
const service = new StackService(repo);
const controller = new StackController(service);

export const stackRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     StackRequest:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: 스택 이름
 *         level:
 *           type: string
 *           description: 숙련도 (선택)
 *     StackResponse:
 *       type: object
 *       properties:
 *         stackId:
 *           type: number
 *         userId:
 *           type: number
 *         name:
 *           type: string
 *         level:
 *           type: string
 */

/**
 * @swagger
 * /api/stacks:
 *   get:
 *     summary: 스택 목록 조회
 *     tags: [Stack]
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
 *                     $ref: '#/components/schemas/StackResponse'
 */
stackRouter.get('/stacks', authenticate, controller.list);

/**
 * @swagger
 * /api/stacks:
 *   post:
 *     summary: 스택 일괄 등록/수정 (배열)
 *     description: 기존 스택을 모두 삭제하고 새로운 스택들로 교체합니다. 빈 배열을 보내면 모든 스택이 삭제됩니다.
 *     tags: [Stack]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - stacks
 *             properties:
 *               stacks:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/StackRequest'
 *           example:
 *             stacks:
 *               - name: "React"
 *                 level: "Advanced"
 *               - name: "TypeScript"
 *                 level: "Intermediate"
 *               - name: "Node.js"
 *                 level: null
 *     responses:
 *       201:
 *         description: 등록 성공
 */
stackRouter.post('/stacks', authenticate, controller.create);

/**
 * @swagger
 * /api/stacks/{stackId}:
 *   patch:
 *     summary: 스택 수정
 *     tags: [Stack]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: stackId
 *         required: true
 *         schema:
 *           type: number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StackRequest'
 *     responses:
 *       200:
 *         description: 수정 성공
 */
stackRouter.patch('/stacks/:stackId', authenticate, controller.update);

/**
 * @swagger
 * /api/stacks/{stackId}:
 *   delete:
 *     summary: 스택 삭제
 *     tags: [Stack]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: stackId
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: 삭제 성공
 */
stackRouter.delete('/stacks/:stackId', authenticate, controller.remove);

/**
 * @swagger
 * /api/stacks/{stackId}:
 *   get:
 *     summary: 스택 조회
 *     tags: [Stack]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: stackId
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: 조회 성공
 *       404:
 *         description: 스택을 찾을 수 없음
 */
stackRouter.get('/stacks/:stackId', authenticate, controller.detail);
