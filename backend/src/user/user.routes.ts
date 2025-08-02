import { Router } from 'express';
import { UserController } from './user.controller';
import { validate } from '../shared/middleware/validation';
import { updateUserSchema, updatePasswordSchema } from './user.validation';

const router = Router();
const userController = new UserController();

// GET /api/user/profile
router.get('/profile', userController.getProfile);

// PATCH /api/user/update
router.patch('/update', validate(updateUserSchema), userController.updateProfile);

// PATCH /api/user/password
router.patch('/password', validate(updatePasswordSchema), userController.updatePassword);

// DELETE /api/user/account
router.delete('/account', userController.deleteAccount);

export default router;
