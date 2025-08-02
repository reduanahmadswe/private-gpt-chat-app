import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const createError = (message: string, statusCode: number = 500): AppError => {
  const error: AppError = new Error(message);
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
};

export const errorHandler = (
  error: AppError | ZodError | Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal server error';
  let errors: any[] = [];

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    statusCode = 400;
    message = 'Validation error';
    errors = error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));
  }
  // Handle operational errors
  else if ('isOperational' in error && error.isOperational) {
    statusCode = error.statusCode || 500;
    message = error.message;
  }
  // Handle MongoDB duplicate key error
  else if ('code' in error && (error as any).code === 11000) {
    statusCode = 400;
    const field = Object.keys((error as any).keyValue)[0];
    message = `${field} already exists`;
  }
  // Handle JWT errors
  else if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }
  else if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }
  // Development error details
  else if (process.env.NODE_ENV === 'development') {
    message = error.message;
    console.error('Error Details:', error);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors.length > 0 && { errors }),
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
};

export const notFound = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
};
