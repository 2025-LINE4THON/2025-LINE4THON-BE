import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { CareerRepository } from './career.repository';
import { CareerService } from './career.service';
import { CareerController } from './career.controller';

const repo = new CareerRepository();
const service = new CareerService(repo);
const controller = new CareerController(service);

export const careerRouter = Router();

// (선택) 목록 조회
careerRouter.get('/careers', authenticate, controller.list);

// 사양에 맞춘 4개
// 3.2. 경력 등록
careerRouter.post('/careers', authenticate, controller.create);

// 3.2.1. 경력 수정
careerRouter.patch('/careers/:careerId', authenticate, controller.update);

// 3.2.2. 경력 삭제
careerRouter.delete('/careers/:careerId', authenticate, controller.remove);

// 3.2.3. 경력 상세 조회
careerRouter.get('/careers/:careerId', authenticate, controller.detail);
