import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validate } from '../../middleware/validate';
import { RegisterDto, LoginDto } from './auth.dto';

const router = Router();
const authController = new AuthController();

router.post('/register', validate(RegisterDto), authController.register);
router.post('/login', validate(LoginDto), authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);

export default router;
