import { envVars } from '../config/env';
import { createError } from '../shared/middleware/errorHandler';
import { IChatCreate, IChatResponse, IChatUpdate } from './chat.interface';
import { Chat } from './chat.model';

export class ChatService {
  private async callOpenRouterAPI(message: string): Promise<string> {
    const apiKey = envVars.OPENROUTER_API_KEY;
    const baseURL = envVars.OPENAI_API_BASE_URL;

    try {
      const response = await fetch(`${baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': envVars.FRONTEND_URL,
          'X-Title': 'Private GPT Chat',
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3.5-sonnet',
          messages: [
            {
              role: 'user',
              content: message,
            },
          ],
          max_tokens: message.length > 500 ? 800 : 1000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('OpenRouter API Error:', errorData);

        if (response.status === 401) {
          throw createError('Invalid API key', 401);
        }

        if (response.status === 429) {
          throw createError('Rate limit exceeded - please try again later', 429);
        }

        throw createError('Failed to get AI response', 500);
      }

      const data: any = await response.json();
      return data.choices[0]?.message?.content || 'No response generated';
    } catch (error: any) {
      console.error('OpenRouter API Error:', error.message);

      if (error.name === 'AbortError') {
        throw createError('Request timeout - please try again', 408);
      }

      throw createError('Failed to get AI response', 500);
    }
  }

  async createOrUpdateChat(userId: string, data: IChatCreate): Promise<IChatResponse> {
    const { message, chatId } = data;

    let chat;

    if (chatId) {
      // Add to existing chat
      chat = await Chat.findOne({ _id: chatId, userId });
      if (!chat) {
        throw createError('Chat not found', 404);
      }
    } else {
      // Create new chat
      chat = new Chat({
        userId,
        title: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
        messages: [],
      });
    }

    // Add user message
    chat.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date(),
    });

    // Get AI response
    const aiResponse = await this.callOpenRouterAPI(message);

    // Add AI response
    chat.messages.push({
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date(),
    });

    await chat.save();

    return {
      chat,
      response: aiResponse,
    };
  }

  async getUserChats(userId: string) {
    const chats = await Chat.find({ userId })
      .sort({ updatedAt: -1 })
      .select('title messages createdAt updatedAt isShared');

    return chats;
  }

  async getChatById(chatId: string, userId?: string) {
    const query: any = { _id: chatId };

    // If userId is provided, ensure the chat belongs to the user or is shared
    if (userId) {
      query.$or = [
        { userId },
        { isShared: true }
      ];
    } else {
      // If no userId, only return shared chats
      query.isShared = true;
    }

    const chat = await Chat.findOne(query);
    if (!chat) {
      throw createError('Chat not found or access denied', 404);
    }

    return chat;
  }

  async updateChatTitle(chatId: string, userId: string, data: IChatUpdate) {
    const chat = await Chat.findOneAndUpdate(
      { _id: chatId, userId },
      { title: data.title },
      { new: true }
    );

    if (!chat) {
      throw createError('Chat not found', 404);
    }

    return chat;
  }

  async deleteChat(chatId: string, userId: string) {
    const chat = await Chat.findOneAndDelete({ _id: chatId, userId });

    if (!chat) {
      throw createError('Chat not found', 404);
    }

    return { message: 'Chat deleted successfully' };
  }

  async shareChat(chatId: string, userId: string) {
    const chat = await Chat.findOneAndUpdate(
      { _id: chatId, userId },
      { isShared: true },
      { new: true }
    );

    if (!chat) {
      throw createError('Chat not found', 404);
    }

    return {
      message: 'Chat shared successfully',
      shareUrl: `${envVars.CLIENT_URL}/chat/${chatId}`,
      chat,
    };
  }

  async unshareChat(chatId: string, userId: string) {
    const chat = await Chat.findOneAndUpdate(
      { _id: chatId, userId },
      { isShared: false },
      { new: true }
    );

    if (!chat) {
      throw createError('Chat not found', 404);
    }

    return {
      message: 'Chat unshared successfully',
      chat,
    };
  }
}
