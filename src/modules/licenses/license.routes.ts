import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { LicenseRepository } from './license.repository';
import { LicenseService } from './license.service';
import { LicenseController } from './license.controller';

const repo = new LicenseRepository();
const service = new LicenseService(repo);
const controller = new LicenseController(service);

export const licenseRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     LicenseRequest:
 *       type: object
 *       required:
 *         - name
 *         - gotDate
 *       properties:
 *         name:
 *           type: string
 *           description: 자격증 이름
 *         gotDate:
 *           type: string
 *           format: date-time
 *           description: 취득일
 *         endDate:
 *           type: string
 *           format: date-time
 *           description: 만료일 (선택)
 *     LicenseResponse:
 *       type: object
 *       properties:
 *         licenseId:
 *           type: number
 *         userId:
 *           type: number
 *         name:
 *           type: string
 *         gotDate:
 *           type: string
 *           format: date-time
 *         endDate:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/licenses:
 *   get:
 *     summary: 자격증 목록 조회
 *     tags: [License]
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
 *                     $ref: '#/components/schemas/LicenseResponse'
 */
licenseRouter.get('/licenses', authenticate, controller.list);

/**
 * @swagger
 * /api/licenses:
 *   post:
 *     summary: 자격증 일괄 등록/수정 (배열)
 *     description: 기존 자격증을 모두 삭제하고 새로운 자격증들로 교체합니다. 빈 배열을 보내면 모든 자격증이 삭제됩니다.
 *     tags: [License]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - licenses
 *             properties:
 *               licenses:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/LicenseRequest'
 *           example:
 *             licenses:
 *               - name: "정보처리기사"
 *                 gotDate: "2024-06-15"
 *                 endDate: null
 *               - name: "AWS Solutions Architect"
 *                 gotDate: "2024-03-20"
 *                 endDate: "2027-03-20"
 *     responses:
 *       201:
 *         description: 등록 성공
 */
licenseRouter.post('/licenses', authenticate, controller.create);

/**
 * @swagger
 * /api/licenses/{licenseId}:
 *   patch:
 *     summary: 자격증 수정
 *     tags: [License]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: licenseId
 *         required: true
 *         schema:
 *           type: number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LicenseRequest'
 *     responses:
 *       200:
 *         description: 수정 성공
 */
licenseRouter.patch('/licenses/:licenseId', authenticate, controller.update);

/**
 * @swagger
 * /api/licenses/{licenseId}:
 *   delete:
 *     summary: 자격증 삭제
 *     tags: [License]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: licenseId
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: 삭제 성공
 */
licenseRouter.delete('/licenses/:licenseId', authenticate, controller.remove);

/**
 * @swagger
 * /api/licenses/{licenseId}:
 *   get:
 *     summary: 자격증 조회
 *     tags: [License]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: licenseId
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: 조회 성공
 *       404:
 *         description: 자격증을 찾을 수 없음
 */
licenseRouter.get('/licenses/:licenseId', authenticate, controller.detail);
