import { Router } from 'express';
import { PortfolioController } from './porpolio.controller';
import { validate } from '../../middleware/validate';
import { CreatePortfolioDto, UpdatePortfolioDto } from './portpolios.dto';
import { authenticate } from '../../middleware/authenticate';

const router = Router();
const controller = new PortfolioController();

/**
 * @swagger
 * components:
 *   schemas:
 *     PortfolioCreate:
 *       type: object
 *       required:
 *         - template
 *         - title
 *         - isPublic
 *       properties:
 *         template:
 *           type: string
 *           enum: [STANDARD, IMAGE]
 *           description: 포트폴리오 템플릿 타입
 *         skills:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: number
 *               rank:
 *                 type: number
 *         careers:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: number
 *               description:
 *                 type: string
 *         projectIds:
 *           type: array
 *           items:
 *             type: number
 *         title:
 *           type: string
 *           description: 포트폴리오 제목
 *         introduction:
 *           type: string
 *           description: 소개글
 *         aboutMe:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *           description: 자기소개 섹션 배열
 *         thumbnail:
 *           type: string
 *           description: 썸네일 URL
 *         coverImage:
 *           type: string
 *           description: 커버 이미지 URL
 *         isPublic:
 *           type: string
 *           enum: [PUBLIC, PRIVATE, LINK]
 *     PortfolioResponse:
 *       type: object
 *       properties:
 *         portfolioId:
 *           type: number
 *         userId:
 *           type: number
 *         userName:
 *           type: string
 *         userJob:
 *           type: string
 *         title:
 *           type: string
 *         thumbnail:
 *           type: string
 *         coverImage:
 *           type: string
 *         template:
 *           type: string
 *         views:
 *           type: number
 *         likesCount:
 *           type: number
 *         isPublic:
 *           type: string
 *         introduction:
 *           type: string
 *         aboutMe:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/portfolios/search:
 *   get:
 *     summary: 포트폴리오 검색
 *     tags: [Portfolio]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: 검색 키워드
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [recent, views]
 *         description: 정렬 기준
 *       - in: query
 *         name: template
 *         schema:
 *           type: string
 *           enum: [IMAGE, STANDARD]
 *       - in: query
 *         name: isPublic
 *         schema:
 *           type: string
 *           enum: [PUBLIC, PRIVATE, LINK]
 *     responses:
 *       200:
 *         description: 검색 성공
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
 *                     $ref: '#/components/schemas/PortfolioResponse'
 */
router.get('/portfolios/search', controller.searchPortfolios);

/**
 * @swagger
 * /api/portfolios/recommend:
 *   get:
 *     summary: 추천 포트폴리오 조회 (조회수 TOP 10)
 *     tags: [Portfolio]
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
 *                     $ref: '#/components/schemas/PortfolioResponse'
 */
router.get('/portfolios/recommend', controller.getRecommended);

/**
 * @swagger
 * /api/users/{userId}/portfolios:
 *   get:
 *     summary: 사용자별 포트폴리오 조회
 *     tags: [Portfolio]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: number
 *         description: 사용자 ID
 *     responses:
 *       200:
 *         description: 조회 성공
 */
router.get('/users/:userId/portfolios', controller.getByUserId);

/**
 * @swagger
 * /api/portfolios/{id}:
 *   get:
 *     summary: 포트폴리오 상세 조회
 *     tags: [Portfolio]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: 포트폴리오 ID
 *     responses:
 *       200:
 *         description: 조회 성공
 *       404:
 *         description: 포트폴리오를 찾을 수 없음
 */
router.get('/portfolios/:id', controller.getPortfolioDetail);

/**
 * @swagger
 * /api/portfolios:
 *   post:
 *     summary: 포트폴리오 생성
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PortfolioCreate'
 *     responses:
 *       201:
 *         description: 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 포트폴리오 생성이 완료되었습니다.
 *                 data:
 *                   type: object
 *                   properties:
 *                     portpolioId:
 *                       type: number
 *                 statusCode:
 *                   type: number
 *                   example: 201
 *       401:
 *         description: 인증 필요
 */
router.post('/portfolios', authenticate, validate(CreatePortfolioDto), controller.createPortfolio);

/**
 * @swagger
 * /api/portfolios/{id}:
 *   patch:
 *     summary: 포트폴리오 수정
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PortfolioCreate'
 *     responses:
 *       200:
 *         description: 수정 성공
 *       403:
 *         description: 권한 없음
 */
router.patch('/portfolios/:id', authenticate, validate(UpdatePortfolioDto), controller.updatePortfolio);

/**
 * @swagger
 * /api/portfolios/{id}:
 *   delete:
 *     summary: 포트폴리오 삭제
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: 삭제 성공
 *       403:
 *         description: 권한 없음
 */
router.delete('/portfolios/:id', authenticate, controller.deletePortfolio);


/**
 * @swagger
 * /api/portfolios/check:
 *   get:
 *     summary: 포트폴리오 필수 요소 확인
 *     description: 사용자가 포트폴리오 생성에 필요한 필수 요소(경력, 기술스택, 프로젝트, 직군)를 입력했는지 확인
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 필수 요소 확인 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     career:
 *                       type: boolean
 *                       description: 경력 입력 여부
 *                     stack:
 *                       type: boolean
 *                       description: 기술스택 입력 여부
 *                     project:
 *                       type: boolean
 *                       description: 프로젝트 입력 여부
 *                     job:
 *                       type: boolean
 *                       description: 직군 입력 여부
 *       401:
 *         description: 인증 필요
 */
router.get('/portfolios/check', authenticate, controller.checkPortfolioRequirements);

/**
 * @swagger
 * /api/portfolios/{id}/like:
 *   post:
 *     summary: 포트폴리오 좋아요
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: 포트폴리오 ID
 *     responses:
 *       200:
 *         description: 좋아요 성공
 *       400:
 *         description: 이미 좋아요한 포트폴리오
 *       401:
 *         description: 인증 필요
 */
router.post('/portfolios/:id/like', authenticate, controller.likePortfolio);

/**
 * @swagger
 * /api/portfolios/{id}/unlike:
 *   delete:
 *     summary: 포트폴리오 좋아요 취소
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: 포트폴리오 ID
 *     responses:
 *       200:
 *         description: 좋아요 취소 성공
 *       400:
 *         description: 좋아요하지 않은 포트폴리오
 *       401:
 *         description: 인증 필요
 */
router.delete('/portfolios/:id/unlike', authenticate, controller.unlikePortfolio);

export default router;


