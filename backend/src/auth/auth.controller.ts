import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { RegisterInput, LoginInput } from './auth.validation';

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: RegisterInput = req.body;
      const result = await authService.register(data);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: LoginInput = req.body;
      const result = await authService.login(data);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;
      
      if (!refreshToken) {
        res.status(400).json({
          success: false,
          message: 'Refresh token required',
        });
        return;
      }

      const result = await authService.refreshToken(refreshToken);

      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    // Since we're using stateless JWT, logout is handled on the client side
    // In a production app, you might want to implement token blacklisting
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  }
}
