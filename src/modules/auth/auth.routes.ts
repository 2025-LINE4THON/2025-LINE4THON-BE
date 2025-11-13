import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validate } from '../../middleware/validate';
import { SignupDto, LoginDto, CheckIdDto } from './auth.dto';

const router = Router();
const authController = new AuthController();

/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           minLength: 3
 *           description: 사용자 아이디
 *         password:
 *           type: string
 *           minLength: 8
 *           description: 비밀번호
 *         name:
 *           type: string
 *           minLength: 2
 *           description: 이름 (선택)
 *         email:
 *           type: string
 *           format: email
 *           description: 이메일 (선택)
 *         phoneNumber:
 *           type: number
 *           description: 전화번호 (선택)
 *         introduction:
 *           type: string
 *           description: 자기소개 (선택)
 *         job:
 *           type: string
 *           description: 직업 (선택)
 *     LoginRequest:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *         password:
 *           type: string
 *     AuthResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             accessToken:
 *               type: string
 *             user:
 *               type: object
 */

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: 회원가입
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignupRequest'
 *     responses:
 *       201:
 *         description: 회원가입 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: 검증 실패 또는 중복된 사용자
 */
router.post('/signup', validate(SignupDto), authController.signup);

/**
 * @swagger
 * /api/auth/checkid:
 *   post:
 *     summary: 아이디 중복 확인
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 description: 확인할 사용자 아이디
 *     responses:
 *       200:
 *         description: 사용 가능한 아이디
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 사용 가능한 아이디입니다
 *                 data:
 *                   type: object
 *                   properties:
 *                     success:
 *                       type: boolean
 *                       example: true
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *       400:
 *         description: 중복된 아이디
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 중복된 아이디입니다
 *                 data:
 *                   type: object
 *                   properties:
 *                     success:
 *                       type: boolean
 *                       example: false
 *                 statusCode:
 *                   type: number
 *                   example: 400
 */
router.post('/checkid', validate(CheckIdDto), authController.checkId);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: 로그인
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: 로그인 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *         headers:
 *           Set-Cookie:
 *             description: Refresh Token (httpOnly)
 *             schema:
 *               type: string
 *       401:
 *         description: 인증 실패
 */
router.post('/login', validate(LoginDto), authController.login);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Access Token 갱신
 *     tags: [Auth]
 *     description: Refresh Token을 사용하여 새로운 Access Token 발급
 *     responses:
 *       200:
 *         description: 토큰 갱신 성공
 *       401:
 *         description: 유효하지 않은 Refresh Token
 */
router.post('/refresh', authController.refresh);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: 로그아웃
 *     tags: [Auth]
 *     description: Refresh Token 쿠키 제거
 *     responses:
 *       200:
 *         description: 로그아웃 성공
 */
router.post('/logout', authController.logout);

export default router;
