import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { validate } from '../../middleware/validate';
import { UserController } from './user.controller';
import { UpdateMyInfoDto } from './user.dto';

const router = Router();
const controller = new UserController();

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateMyInfoRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           minLength: 2
 *           description: 이름
 *         email:
 *           type: string
 *           format: email
 *           description: 이메일
 *         phoneNumber:
 *           type: number
 *           description: 전화번호
 *         introduction:
 *           type: string
 *           description: 자기소개
 *         job:
 *           type: string
 *           description: 직업
 *     UserInfoResponse:
 *       type: object
 *       properties:
 *         userId:
 *           type: number
 *         username:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         phoneNumber:
 *           type: number
 *         introduction:
 *           type: string
 *         job:
 *           type: string
 */

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: 내 정보 조회
 *     tags: [User]
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
 *                   $ref: '#/components/schemas/UserInfoResponse'
 *       401:
 *         description: 인증 필요
 */
router.get('/me', authenticate, controller.getMyInfo);

/**
 * @swagger
 * /api/users/me:
 *   patch:
 *     summary: 내 정보 수정
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateMyInfoRequest'
 *     responses:
 *       200:
 *         description: 수정 성공
 *       401:
 *         description: 인증 필요
 */
router.patch('/me', authenticate, validate(UpdateMyInfoDto), controller.updateMyInfo);

/**
 * @swagger
 * /api/users/me/careers:
 *   get:
 *     summary: 내 경력 목록 조회
 *     tags: [User]
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
 *                     type: object
 */
router.get('/me/careers', authenticate, controller.getMyCareers);

/**
 * @swagger
 * /api/users/me/licenses:
 *   get:
 *     summary: 내 자격증 목록 조회
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 조회 성공
 */
router.get('/me/licenses', authenticate, controller.getMyLicenses);

/**
 * @swagger
 * /api/users/me/stacks:
 *   get:
 *     summary: 내 스택 목록 조회
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 조회 성공
 */
router.get('/me/stacks', authenticate, controller.getMyStacks);

/**
 * @swagger
 * /api/users/me/projects:
 *   get:
 *     summary: 내 프로젝트 목록 조회
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 조회 성공
 */
router.get('/me/projects', authenticate, controller.getMyProjects);

/**
 * @swagger
 * /api/users/me/portfolios:
 *   get:
 *     summary: 내 포트폴리오 목록 조회
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 조회 성공
 */
router.get('/me/portfolios', authenticate, controller.getMyPortfolios);

export default router;
