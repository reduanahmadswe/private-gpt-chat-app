import { Router } from 'express';
import { validate } from '../shared/middleware/validation';
import { ChatController } from './chat.controller';
import { chatParamsSchema, createChatSchema, updateChatSchema } from './chat.validation';

const router = Router();
const chatController = new ChatController();

// POST /api/chat - Send message to AI
router.post('/', validate(createChatSchema), chatController.createChat);

// GET /api/chat - Get all user chats
router.get('/', chatController.getChats);

// GET /api/chat/:id - Get specific chat
router.get('/:id', validate(chatParamsSchema), chatController.getChatById);

// PATCH /api/chat/:id - Update chat title
router.patch('/:id', validate(chatParamsSchema), validate(updateChatSchema), chatController.updateChat);

// DELETE /api/chat/:id - Delete chat
router.delete('/:id', validate(chatParamsSchema), chatController.deleteChat);

// POST /api/chat/:id/share - Share chat
router.post('/:id/share', validate(chatParamsSchema), chatController.shareChat);

// POST /api/chat/:id/unshare - Unshare chat
router.post('/:id/unshare', validate(chatParamsSchema), chatController.unshareChat);

export default router;
