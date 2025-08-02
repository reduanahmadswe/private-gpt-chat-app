import { Request, Response, NextFunction } from 'express';
import { ChatService } from './chat.service';
import { AuthRequest } from '../shared/middleware/auth';
import { CreateChatInput, UpdateChatInput, ChatParamsInput } from './chat.validation';

const chatService = new ChatService();

export class ChatController {
  async createChat(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
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

  async getChats(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
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

  async getChatById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as AuthRequest).user?.id; // Optional for shared chats
      
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

  async updateChat(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
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

  async deleteChat(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
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

  async shareChat(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
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

  async unshareChat(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
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
