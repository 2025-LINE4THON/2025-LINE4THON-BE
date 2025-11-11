import { Router } from 'express';

const router = Router();

router.post('/portpolios', (req, res) => {
  // 포트폴리오 생성 로직
  res.status(201).send({ message: 'Portpolio created' });
});