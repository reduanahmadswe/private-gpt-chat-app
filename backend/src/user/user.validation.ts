import { z } from 'zod';

export const updateUserSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, 'Name cannot be empty')
      .max(100, 'Name cannot exceed 100 characters')
      .trim()
      .optional(),
    email: z
      .string()
      .email('Please enter a valid email address')
      .toLowerCase()
      .optional(),
  }),
});

export const updatePasswordSchema = z.object({
  body: z.object({
    currentPassword: z
      .string({
        required_error: 'Current password is required',
      })
      .min(1, 'Current password cannot be empty'),
    newPassword: z
      .string({
        required_error: 'New password is required',
      })
      .min(6, 'New password must be at least 6 characters')
      .max(100, 'New password cannot exceed 100 characters'),
  }),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>['body'];
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>['body'];
