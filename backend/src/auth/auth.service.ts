import jwt from 'jsonwebtoken';
import { User } from '../user/user.model';
import { IAuthRequest, IRegisterRequest, IAuthResponse, IJWTPayload } from './auth.interface';
import { createError } from '../shared/middleware/errorHandler';

export class AuthService {
  private generateTokens(userId: string, email: string): { token: string; refreshToken: string } {
    const jwtSecret = process.env.JWT_SECRET;
    const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;

    if (!jwtSecret || !jwtRefreshSecret) {
      throw createError('JWT secrets not configured', 500);
    }

    const payload: IJWTPayload = { userId, email };

    const token = jwt.sign(payload, jwtSecret, { expiresIn: '1d' });
    const refreshToken = jwt.sign(payload, jwtRefreshSecret, { expiresIn: '7d' });

    return { token, refreshToken };
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

    // Generate tokens
    const tokens = this.generateTokens(user._id.toString(), user.email);

    return {
      ...tokens,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    };
  }

  async login(data: IAuthRequest): Promise<IAuthResponse> {
    const { email, password } = data;

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw createError('Invalid email or password', 401);
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw createError('Invalid email or password', 401);
    }

    // Generate tokens
    const tokens = this.generateTokens(user._id.toString(), user.email);

    return {
      ...tokens,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    };
  }

  async refreshToken(refreshToken: string): Promise<{ token: string }> {
    const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;

    if (!jwtRefreshSecret) {
      throw createError('JWT refresh secret not configured', 500);
    }

    try {
      const decoded = jwt.verify(refreshToken, jwtRefreshSecret) as IJWTPayload;
      const user = await User.findById(decoded.userId);

      if (!user) {
        throw createError('Invalid refresh token', 401);
      }

      // Generate new access token
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw createError('JWT secret not configured', 500);
      }

      const token = jwt.sign(
        { userId: decoded.userId, email: decoded.email },
        jwtSecret,
        { expiresIn: '1d' }
      );

      return { token };
    } catch (error) {
      throw createError('Invalid refresh token', 401);
    }
  }
}
