import { Router } from 'express';
import passport from 'passport';
import { authenticate } from '../shared/middleware/auth';
import { validate } from '../shared/middleware/validation';
import { AuthController } from './auth.controller';
import { loginSchema, registerSchema } from './auth.validation';

const router = Router();
const authController = new AuthController();

// Traditional Auth Routes
// POST /api/auth/signup
router.post('/signup', validate(registerSchema), authController.register);

// POST /api/auth/signin
router.post('/signin', validate(loginSchema), authController.login);

// POST /api/auth/refresh
router.post('/refresh', authController.refreshToken);

// POST /api/auth/logout
router.post('/logout', authenticate, authController.logout);

// Google OAuth Routes
// GET /api/auth/google
router.get('/google',
    passport.authenticate('google', {
        scope: ['profile', 'email']
    })
);

// GET /api/auth/google/callback
router.get('/google/callback',
    passport.authenticate('google', {
        session: false
    }),
    authController.googleCallback
);

// GET /api/auth/me - Get current user
router.get('/me', authenticate, authController.getCurrentUser);

export default router;
