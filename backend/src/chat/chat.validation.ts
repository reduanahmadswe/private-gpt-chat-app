import { z } from 'zod';

export const createChatSchema = z.object({
  body: z.object({
    message: z
      .string({
        required_error: 'Message is required',
      })
      .min(1, 'Message cannot be empty')
      .max(5000, 'Message cannot exceed 5000 characters')
      .trim(),
    chatId: z.string().optional(),
  }),
});

export const updateChatSchema = z.object({
  body: z.object({
    title: z
      .string({
        required_error: 'Title is required',
      })
      .min(1, 'Title cannot be empty')
      .max(200, 'Title cannot exceed 200 characters')
      .trim(),
  }),
});

export const chatParamsSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: 'Chat ID is required',
    }),
  }),
});

export const voiceChatSchema = z.object({
  body: z.object({
    message: z
      .string({
        required_error: 'Voice message is required',
      })
      .min(1, 'Voice message cannot be empty')
      .max(5000, 'Voice message cannot exceed 5000 characters')
      .trim(),
  }),
});

export type CreateChatInput = z.infer<typeof createChatSchema>['body'];
export type UpdateChatInput = z.infer<typeof updateChatSchema>['body'];
export type ChatParamsInput = z.infer<typeof chatParamsSchema>['params'];
export type VoiceChatInput = z.infer<typeof voiceChatSchema>['body'];
