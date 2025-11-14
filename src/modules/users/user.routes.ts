import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { validate } from '../../middleware/validate';
import { UserController } from './user.controller';
import { UpdateMyInfoDto, CreateUserLinkDto, UpdateUserLinkDto } from './user.dto';

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

/**
 * @swagger
 * /api/users/me/links:
 *   get:
 *     summary: 내 링크 목록 조회
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
 *                     properties:
 *                       userLinkId:
 *                         type: number
 *                       userId:
 *                         type: number
 *                       linkType:
 *                         type: string
 *                         description: github, blog, notion, instagram, youtube, etc
 *                       url:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *   post:
 *     summary: 링크 생성
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - linkType
 *               - url
 *             properties:
 *               linkType:
 *                 type: string
 *                 description: github, blog, notion, instagram, youtube, etc
 *               url:
 *                 type: string
 *                 format: uri
 *     responses:
 *       201:
 *         description: 생성 성공
 *       401:
 *         description: 인증 필요
 */
router.get('/me/links', authenticate, controller.getMyLinks);
router.post('/me/links', authenticate, validate(CreateUserLinkDto), controller.createLink);

/**
 * @swagger
 * /api/users/me/links/{id}:
 *   patch:
 *     summary: 링크 수정
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: 링크 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               linkType:
 *                 type: string
 *               url:
 *                 type: string
 *                 format: uri
 *     responses:
 *       200:
 *         description: 수정 성공
 *       403:
 *         description: 권한 없음
 *   delete:
 *     summary: 링크 삭제
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: 링크 ID
 *     responses:
 *       200:
 *         description: 삭제 성공
 *       403:
 *         description: 권한 없음
 */
router.patch('/me/links/:id', authenticate, validate(UpdateUserLinkDto), controller.updateLink);
router.delete('/me/links/:id', authenticate, controller.deleteLink);

export default router;
