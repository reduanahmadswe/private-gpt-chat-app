import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validate } from '../shared/middleware/validation';
import { registerSchema, loginSchema } from './auth.validation';

const router = Router();
const authController = new AuthController();

// POST /api/auth/signup
router.post('/signup', validate(registerSchema), authController.register);

// POST /api/auth/signin
router.post('/signin', validate(loginSchema), authController.login);

// POST /api/auth/refresh
router.post('/refresh', authController.refreshToken);

// POST /api/auth/logout
router.post('/logout', authController.logout);

export default router;
