import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { IJWTPayload } from '../../auth/auth.interface';
import { envVars } from '../../config/env';
import { IUser } from '../../user/user.interface';
import { User } from '../../user/user.model';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Access token required',
      });
      return;
    }

    const token = authHeader.substring(7);
    const jwtSecret = envVars.JWT_SECRET;

    const decoded = jwt.verify(token, jwtSecret) as IJWTPayload;
    const user = await User.findById(decoded.userId);

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid token - user not found',
      });
      return;
    }

    const userObj = user.toObject() as IUser;
    userObj.id = userObj._id; // Add id alias for easier access
    req.user = userObj;

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Authentication error',
    });
  }
};
