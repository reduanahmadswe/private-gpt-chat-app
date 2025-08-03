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

// Facebook OAuth Routes
// GET /api/auth/facebook
router.get('/facebook',
    passport.authenticate('facebook', {
        scope: ['public_profile']
    })
);

// GET /api/auth/facebook/callback
router.get('/facebook/callback',
    passport.authenticate('facebook', {
        session: false
    }),
    authController.facebookCallback
);

// GET /api/auth/me - Get current user
router.get('/me', authenticate, authController.getCurrentUser);

export default router;
