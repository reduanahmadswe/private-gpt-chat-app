import { NextFunction, Request, Response } from 'express';
import { envVars } from '../config/env';
import { IUser } from '../user/user.interface';
import { AuthService } from './auth.service';
import { LoginInput, RegisterInput } from './auth.validation';

const authService = new AuthService();

export class AuthController {
  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

  refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

  logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user as IUser;

      if (user?._id) {
        await authService.logout(user._id.toString());
      }

      // Clear cookies if they exist
      res.clearCookie('token');
      res.clearCookie('refreshToken');

      res.status(200).json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  // Google OAuth Routes
  googleAuth = async (req: Request, res: Response): Promise<void> => {
    // This is handled by passport middleware
    // Redirect happens automatically
  }

  googleCallback = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user as IUser;

      if (!user) {
        console.error('❌ No user found in Google OAuth callback');
        const errorUrl = `${envVars.CLIENT_URL}/auth/signin?error=oauth_failed`;
        return res.redirect(errorUrl);
      }

      console.log('🎉 Google OAuth successful for:', user.email);
      console.log('🔑 Handling Google OAuth for user:', user.email);

      // Generate tokens for the authenticated user
      const result = await authService.handleGoogleOAuth(user);

      // Set secure HTTP-only cookies for enhanced security
      const isProduction = envVars.NODE_ENV === 'production';

      // Set access token cookie
      res.cookie('token', result.token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        path: '/',
      });

      // Set refresh token cookie
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: '/',
      });

      // For development: also pass token as query parameter for easier testing
      // In production, rely on cookies only for security
      let redirectUrl: string;

      if (isProduction) {
        // Production: Use secure cookies only
        redirectUrl = `${envVars.CLIENT_URL}/dashboard?auth=success&provider=google`;
      } else {
        // Development: Also pass token in query for easier testing
        redirectUrl = `${envVars.CLIENT_URL}/dashboard?auth=success&provider=google&token=${result.token}`;
      }

      console.log('🚀 Redirecting to:', redirectUrl);
      res.redirect(redirectUrl);

    } catch (error) {
      console.error('❌ Google OAuth callback error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorUrl = `${envVars.CLIENT_URL}/auth/signin?error=oauth_failed&message=${encodeURIComponent(errorMessage)}`;
      res.redirect(errorUrl);
    }
  }

  // Get current user info
  getCurrentUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user as IUser;

      res.status(200).json({
        success: true,
        user: {
          id: user._id?.toString(),
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          authProvider: user.authProvider,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
