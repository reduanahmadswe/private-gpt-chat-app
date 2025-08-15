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

      // Set HttpOnly cookies for secure token storage
      this.setAuthCookies(res, result.token, result.refreshToken, result.tokenExpiry, result.refreshTokenExpiry);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        token: result.token,
        refreshToken: result.refreshToken,
        tokenExpiry: result.tokenExpiry,
        refreshTokenExpiry: result.refreshTokenExpiry,
        user: result.user,
      });
    } catch (error) {
      next(error);
    }
  }

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: LoginInput = req.body;
      const result = await authService.login(data);

      // Set HttpOnly cookies for secure token storage
      this.setAuthCookies(res, result.token, result.refreshToken, result.tokenExpiry, result.refreshTokenExpiry);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        token: result.token,
        refreshToken: result.refreshToken,
        tokenExpiry: result.tokenExpiry,
        refreshTokenExpiry: result.refreshTokenExpiry,
        user: result.user,
      });
    } catch (error) {
      next(error);
    }
  }

  // Helper method to set secure HttpOnly cookies
  private setAuthCookies(res: Response, token: string, refreshToken: string, tokenExpiry?: Date, refreshTokenExpiry?: Date): void {
    const isProduction = envVars.NODE_ENV === 'production';

    // Set access token cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: isProduction, // HTTPS only in production
      sameSite: isProduction ? 'none' : 'lax', // Allow cross-site in production for Vercel
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      expires: tokenExpiry || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      path: '/',
    });

    // Set refresh token cookie  
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      expires: refreshTokenExpiry || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      path: '/',
    });
  }

  refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Try to get refresh token from cookies first, then body
      let refreshToken = req.cookies?.refreshToken || req.body.refreshToken;

      if (!refreshToken) {
        res.status(400).json({
          success: false,
          message: 'Refresh token required',
        });
        return;
      }

      const result = await authService.refreshToken(refreshToken);

      // Set new token in cookie
      this.setAuthCookies(res, result.token, refreshToken);

      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        token: result.token,
      });
    } catch (error) {
      next(error);
    }
  }

  // Verify session endpoint for client-side authentication checks
  verifySession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user as IUser;

      res.status(200).json({
        success: true,
        message: 'Session valid',
        user: {
          id: user._id || user.id,
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

  // Get current user info
  me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user as IUser;

      res.status(200).json({
        success: true,
        user: {
          id: user._id || user.id,
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
      console.log('🌍 CLIENT_URL:', envVars.CLIENT_URL);
      console.log('🌍 NODE_ENV:', envVars.NODE_ENV);

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

      // Check if request is from mobile app by checking query parameter or user agent
      const userAgent = req.get('User-Agent') || '';
      const isMobileApp = req.query.mobile === 'true' ||
        userAgent.includes('AI-Bondhu-Mobile') ||
        req.get('X-Mobile-App') === 'true';

      if (isMobileApp) {
        // Mobile App: Use custom URL scheme for deep linking
        redirectUrl = `aibondhu://auth/callback?auth=success&provider=google&token=${result.token}`;
      } else if (isProduction) {
        // Web Production: Use secure cookies AND pass token for compatibility
        redirectUrl = `${envVars.CLIENT_URL}/dashboard?auth=success&provider=google&token=${result.token}`;
      } else {
        // Web Development: Also pass token in query for easier testing
        redirectUrl = `${envVars.CLIENT_URL}/dashboard?auth=success&provider=google&token=${result.token}`;
      }

      console.log('🚀 Redirecting to:', redirectUrl);
      console.log(process.env.GOOGLE_CALLBACK_URL)
      res.redirect(redirectUrl);

    } catch (error) {
      console.error('❌ Google OAuth callback error:', error);
      console.log('🌍 CLIENT_URL when error:', envVars.CLIENT_URL);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorUrl = `${envVars.CLIENT_URL}/auth/signin?error=oauth_failed&message=${encodeURIComponent(errorMessage)}`;
      console.log('🚀 Error redirect URL:', errorUrl);
      res.redirect(errorUrl);
    }
  }

  facebookCallback = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user as IUser;

      if (!user) {
        console.error('❌ No user found in Facebook OAuth callback');
        const errorUrl = `${envVars.CLIENT_URL}/auth/signin?error=oauth_failed`;
        return res.redirect(errorUrl);
      }

      console.log('🎉 Facebook OAuth successful for:', user.email);
      console.log('🔑 Handling Facebook OAuth for user:', user.email);
      console.log('🌍 CLIENT_URL:', envVars.CLIENT_URL);
      console.log('🌍 NODE_ENV:', envVars.NODE_ENV);

      // Generate tokens for the authenticated user
      const result = await authService.handleFacebookOAuth(user);

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

      // Check if request is from mobile app by checking query parameter or user agent
      const userAgent = req.get('User-Agent') || '';
      const isMobileApp = req.query.mobile === 'true' ||
        userAgent.includes('AI-Bondhu-Mobile') ||
        req.get('X-Mobile-App') === 'true';

      if (isMobileApp) {
        // Mobile App: Use custom URL scheme for deep linking
        redirectUrl = `aibondhu://auth/callback?auth=success&provider=facebook&token=${result.token}`;
      } else if (isProduction) {
        // Web Production: Use secure cookies AND pass token for compatibility
        redirectUrl = `${envVars.CLIENT_URL}/dashboard?auth=success&provider=facebook&token=${result.token}`;
      } else {
        // Web Development: Also pass token in query for easier testing
        redirectUrl = `${envVars.CLIENT_URL}/dashboard?auth=success&provider=facebook&token=${result.token}`;
      }

      console.log('🚀 Redirecting to:', redirectUrl);
      res.redirect(redirectUrl);

    } catch (error) {
      console.error('❌ Facebook OAuth callback error:', error);
      console.log('🌍 CLIENT_URL when error:', envVars.CLIENT_URL);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorUrl = `${envVars.CLIENT_URL}/auth/signin?error=oauth_failed&message=${encodeURIComponent(errorMessage)}`;
      console.log('🚀 Error redirect URL:', errorUrl);
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
