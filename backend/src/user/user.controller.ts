import { NextFunction, Request, Response } from 'express';
import { UserService } from './user.service';
import { UpdatePasswordInput, UpdateUserInput } from './user.validation';

const userService = new UserService();

// Helper function to get user ID from request
const getUserId = (req: Request): string => {
  const user = req.user as any;
  return user._id?.toString() || user.id;
};

export class UserController {
  getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req.user as any)._id?.toString() || (req.user as any).id;
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

  updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = getUserId(req);
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

  updatePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = getUserId(req);
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

  deleteAccount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = getUserId(req);
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
