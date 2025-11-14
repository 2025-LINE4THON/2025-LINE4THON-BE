import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { UploadController } from './upload.controller';
import { authenticate } from '../../middleware/authenticate';

const router = Router();
const controller = new UploadController();

// Multer 설정 - 파일 저장
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // uploads 폴더에 저장
  },
  filename: (req, file, cb) => {
    // 파일명: timestamp-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    cb(null, `${basename}-${uniqueSuffix}${ext}`);
  },
});

// 파일 필터 - 이미지만 허용
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('이미지 파일만 업로드 가능합니다 (jpeg, jpg, png, gif, webp)'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB 제한
  },
});

/**
 * @swagger
 * components:
 *   schemas:
 *     ImageUploadResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         data:
 *           type: object
 *           properties:
 *             imageUrl:
 *               type: string
 *               description: 업로드된 이미지 URL
 *             filename:
 *               type: string
 *               description: 저장된 파일명
 *     MultiImageUploadResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         data:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               imageUrl:
 *                 type: string
 *               filename:
 *                 type: string
 */

/**
 * @swagger
 * /api/uploads/image:
 *   post:
 *     summary: 단일 이미지 업로드
 *     description: 이미지 파일을 업로드하고 URL을 반환합니다. 포트폴리오 썸네일, 커버 이미지, 프로젝트 이미지 등에 사용할 수 있습니다.
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: 업로드할 이미지 파일 (jpeg, jpg, png, gif, webp, 최대 10MB)
 *     responses:
 *       200:
 *         description: 업로드 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ImageUploadResponse'
 *       400:
 *         description: 파일이 없거나 유효하지 않음
 *       401:
 *         description: 인증 필요
 */
router.post('/uploads/image', authenticate, upload.single('image'), controller.uploadImage);

/**
 * @swagger
 * /api/uploads/images:
 *   post:
 *     summary: 다중 이미지 업로드
 *     description: 여러 이미지 파일을 한 번에 업로드합니다 (최대 10개). 프로젝트 갤러리 등에 사용할 수 있습니다.
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: 업로드할 이미지 파일들 (각각 최대 10MB, 최대 10개)
 *     responses:
 *       200:
 *         description: 업로드 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MultiImageUploadResponse'
 *       400:
 *         description: 파일이 없거나 유효하지 않음
 *       401:
 *         description: 인증 필요
 */
router.post('/uploads/images', authenticate, upload.array('images', 10), controller.uploadImages);

export default router;
