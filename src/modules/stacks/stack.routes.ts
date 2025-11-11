import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { StackRepository } from './stack.repository';
import { StackService } from './stack.service';
import { StackController } from './stack.controller';

const repo = new StackRepository();
const service = new StackService(repo);
const controller = new StackController(service);

export const stackRouter = Router();

// (선택) 목록
stackRouter.get('/stacks', authenticate, controller.list);

// 3.4. 스택 등록
stackRouter.post('/stacks', authenticate, controller.create);

// 3.4.1. 스택 수정
stackRouter.patch('/stacks/:stackId', authenticate, controller.update);

// 3.4.2. 스택 삭제
stackRouter.delete('/stacks/:stackId', authenticate, controller.remove);

// 3.4.3. 스택 조회
stackRouter.get('/stacks/:stackId', authenticate, controller.detail);
