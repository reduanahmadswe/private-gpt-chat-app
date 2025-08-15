import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Name is required',
      })
      .min(1, 'Name cannot be empty')
      .max(100, 'Name cannot exceed 100 characters')
      .trim(),
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Please enter a valid email address')
      .toLowerCase(),
    password: z
      .string({
        required_error: 'Password is required',
      })
      .min(6, 'Password must be at least 6 characters')
      .max(100, 'Password cannot exceed 100 characters'),
    rememberMe: z.boolean().optional().default(false),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Please enter a valid email address')
      .toLowerCase(),
    password: z
      .string({
        required_error: 'Password is required',
      })
      .min(1, 'Password cannot be empty'),
    rememberMe: z.boolean().optional().default(false),
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];
