import jwt from 'jsonwebtoken';
import { envVars } from '../config/env';
import { createError } from '../shared/middleware/errorHandler';
import { IUser } from '../user/user.interface';
import { User } from '../user/user.model';
import { IAuthRequest, IAuthResponse, IFacebookOAuthResponse, IGoogleOAuthResponse, IJWTPayload, IRegisterRequest } from './auth.interface';

export class AuthService {
  private generateTokens(userId: string, email: string): { token: string; refreshToken: string; tokenExpiry: Date; refreshTokenExpiry: Date } {
    const jwtSecret = envVars.JWT_SECRET;
    const jwtRefreshSecret = envVars.JWT_REFRESH_SECRET;

    const payload: IJWTPayload = { userId, email };

    // Token expires in 7 days
    const tokenExpiry = new Date();
    tokenExpiry.setDate(tokenExpiry.getDate() + 7);

    // Refresh token expires in 30 days
    const refreshTokenExpiry = new Date();
    refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 30);

    const token = jwt.sign(payload, jwtSecret, { expiresIn: '7d' });
    const refreshToken = jwt.sign(payload, jwtRefreshSecret, { expiresIn: '30d' });

    return { token, refreshToken, tokenExpiry, refreshTokenExpiry };
  }

  // Verify and decode token without throwing errors
  verifyToken(token: string): IJWTPayload | null {
    try {
      const jwtSecret = envVars.JWT_SECRET;
      return jwt.verify(token, jwtSecret) as IJWTPayload;
    } catch (error) {
      return null;
    }
  }

  // Check if token is expired or will expire soon (within 1 hour)
  isTokenExpiringSoon(token: string): boolean {
    try {
      const decoded = jwt.decode(token) as any;
      if (!decoded || !decoded.exp) return true;

      const now = Math.floor(Date.now() / 1000);
      const oneHour = 60 * 60; // 1 hour in seconds

      return decoded.exp - now < oneHour;
    } catch (error) {
      return true;
    }
  }

  async register(data: IRegisterRequest): Promise<IAuthResponse> {
    const { name, email, password } = data;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw createError('User already exists with this email', 400);
    }

    // Create new user
    const user = new User({ name, email, password });
    await user.save();

    // Generate tokens with expiry dates
    const tokens = this.generateTokens(user._id.toString(), user.email);

    return {
      token: tokens.token,
      refreshToken: tokens.refreshToken,
      tokenExpiry: tokens.tokenExpiry,
      refreshTokenExpiry: tokens.refreshTokenExpiry,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        authProvider: user.authProvider,
      },
    };
  }

  async login(data: IAuthRequest): Promise<IAuthResponse> {
    const { email, password } = data;

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log(`❌ Login failed: User not found for email: ${email}`);
      throw createError('Invalid email or password', 401);
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      console.log(`❌ Login failed: Invalid password for email: ${email}`);
      throw createError('Invalid email or password', 401);
    }

    console.log(`✅ Login successful for email: ${email}`);
    // Generate tokens with expiry dates
    const tokens = this.generateTokens(user._id.toString(), user.email);

    return {
      token: tokens.token,
      refreshToken: tokens.refreshToken,
      tokenExpiry: tokens.tokenExpiry,
      refreshTokenExpiry: tokens.refreshTokenExpiry,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        authProvider: user.authProvider,
      },
    };
  }

  async refreshToken(refreshToken: string): Promise<{ token: string; tokenExpiry?: Date }> {
    const jwtRefreshSecret = envVars.JWT_REFRESH_SECRET;

    try {
      const decoded = jwt.verify(refreshToken, jwtRefreshSecret) as IJWTPayload;
      const user = await User.findById(decoded.userId);

      if (!user) {
        throw createError('Invalid refresh token', 401);
      }

      // Generate new access token with expiry info
      const tokens = this.generateTokens(user._id.toString(), user.email);

      return {
        token: tokens.token,
        tokenExpiry: tokens.tokenExpiry
      };
    } catch (error) {
      throw createError('Invalid refresh token', 401);
    }
  }

  async handleGoogleOAuth(user: IUser): Promise<IGoogleOAuthResponse> {
    console.log('🔑 Handling Google OAuth for user:', user.email);

    // Generate tokens
    const tokens = this.generateTokens(user._id!.toString(), user.email);

    return {
      ...tokens,
      user: {
        id: user._id!.toString(),
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        authProvider: 'google',
      },
    };
  }

  async handleFacebookOAuth(user: IUser): Promise<IFacebookOAuthResponse> {
    console.log('🔑 Handling Facebook OAuth for user:', user.email);

    // Generate tokens
    const tokens = this.generateTokens(user._id!.toString(), user.email);

    return {
      ...tokens,
      user: {
        id: user._id!.toString(),
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        authProvider: 'facebook',
      },
    };
  }

  async logout(userId: string): Promise<void> {
    console.log('🚪 Logging out user:', userId);

    // Clear refresh token from database
    await User.findByIdAndUpdate(userId, {
      $unset: { refreshToken: 1 }
    });
  }
}
