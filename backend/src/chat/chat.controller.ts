import { NextFunction, Request, Response } from 'express';
import { ChatService } from './chat.service';
import { CreateChatInput, UpdateChatInput, VoiceChatInput } from './chat.validation';

const chatService = new ChatService();

// Helper function to get user ID from request
const getUserId = (req: Request): string => {
  const user = req.user as any;
  return user._id?.toString() || user.id;
};

export class ChatController {
  createChat = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = getUserId(req);
      const data: CreateChatInput = req.body;
      const result = await chatService.createOrUpdateChat(userId, data);

      res.status(201).json({
        success: true,
        message: 'Message sent successfully',
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  voiceChat = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = getUserId(req);
      const data: VoiceChatInput = req.body;

      // Get AI response using the existing OpenRouter service
      const response = await (chatService as any).callOpenRouterAPI(data.message);

      res.status(200).json({
        success: true,
        message: 'Voice response generated successfully',
        response,
      });
    } catch (error) {
      next(error);
    }
  }

  getChats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = getUserId(req);
      const chats = await chatService.getUserChats(userId);

      res.status(200).json({
        success: true,
        message: 'Chats retrieved successfully',
        chats,
      });
    } catch (error) {
      next(error);
    }
  }

  getChatById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user ? getUserId(req) : undefined; // Optional for shared chats

      const chat = await chatService.getChatById(id, userId);

      res.status(200).json({
        success: true,
        message: 'Chat retrieved successfully',
        chat,
      });
    } catch (error) {
      next(error);
    }
  }

  updateChat = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = getUserId(req);
      const { id } = req.params;
      const data: UpdateChatInput = req.body;

      const chat = await chatService.updateChatTitle(id, userId, data);

      res.status(200).json({
        success: true,
        message: 'Chat updated successfully',
        chat,
      });
    } catch (error) {
      next(error);
    }
  }

  deleteChat = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = getUserId(req);
      const { id } = req.params;

      const result = await chatService.deleteChat(id, userId);

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  shareChat = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = getUserId(req);
      const { id } = req.params;

      const result = await chatService.shareChat(id, userId);

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  unshareChat = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = getUserId(req);
      const { id } = req.params;

      const result = await chatService.unshareChat(id, userId);

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }
}
