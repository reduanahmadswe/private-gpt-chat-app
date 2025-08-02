import { Response, NextFunction } from 'express';
import { UserService } from './user.service';
import { AuthRequest } from '../shared/middleware/auth';
import { UpdateUserInput, UpdatePasswordInput } from './user.validation';

const userService = new UserService();

export class UserController {
  async getProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const user = await userService.getUserProfile(userId);

      res.status(200).json({
        success: true,
        message: 'Profile retrieved successfully',
        user,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const data: UpdateUserInput = req.body;
      const user = await userService.updateProfile(userId, data);

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        user,
      });
    } catch (error) {
      next(error);
    }
  }

  async updatePassword(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const data: UpdatePasswordInput = req.body;
      const result = await userService.updatePassword(userId, data);

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteAccount(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const result = await userService.deleteAccount(userId);

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }
}
