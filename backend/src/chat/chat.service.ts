import { envVars } from '../config/env';
import { createError } from '../shared/middleware/errorHandler';
import { IChatCreate, IChatResponse, IChatUpdate } from './chat.interface';
import { Chat } from './chat.model';

export class ChatService {
  private async callOpenRouterAPI(message: string): Promise<string> {
    const apiKey = envVars.OPENROUTER_API_KEY;
    const baseURL = envVars.OPENAI_API_BASE_URL;

    console.log('🤖 Starting OpenRouter API call...');
    console.log('📝 Message length:', message.length);
    console.log('🔑 API Key present:', !!apiKey);
    console.log('🔑 API Key first 10 chars:', apiKey ? apiKey.substring(0, 10) + '...' : 'MISSING');
    console.log('🌐 Base URL:', baseURL);
    console.log('🌍 Environment:', process.env.NODE_ENV);
    console.log('🔧 All required env vars loaded:', {
      OPENROUTER_API_KEY: !!process.env.OPENROUTER_API_KEY,
      OPENAI_API_BASE_URL: !!process.env.OPENAI_API_BASE_URL,
      FRONTEND_URL: !!process.env.FRONTEND_URL
    });

    try {
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // Reduced to 15 seconds

      const response = await fetch(`${baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': envVars.FRONTEND_URL,
          'X-Title': 'Private GPT Chat',
        },
        body: JSON.stringify({
          model: 'microsoft/phi-3-mini-128k-instruct:free', // Different free model
          messages: [
            {
              role: 'user',
              content: message,
            },
          ],
          max_tokens: 100, // Even smaller for faster response
          temperature: 0.7,
        }),
        signal: controller.signal, // Add timeout signal
      });

      clearTimeout(timeoutId); // Clear timeout if request succeeds

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('OpenRouter API Error:', errorData);
        console.error('Response status:', response.status);
        console.error('Response statusText:', response.statusText);

        if (response.status === 401) {
          throw createError('Invalid API key', 401);
        }

        if (response.status === 402) {
          throw createError('Insufficient credits in OpenRouter account. Please add more credits at https://openrouter.ai/settings/credits', 402);
        }

        if (response.status === 429) {
          throw createError('Rate limit exceeded - please try again later', 429);
        }

        throw createError(`API Error: ${response.status} - ${JSON.stringify(errorData)}`, 500);
      }

      const data: any = await response.json();
      return data.choices[0]?.message?.content || 'No response generated';
    } catch (error: any) {
      console.error('OpenRouter API Error:', error.message);

      if (error.name === 'AbortError') {
        throw createError('Request timeout - please try a shorter message or try again later', 408);
      }

      if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') {
        throw createError('Network timeout - please check your connection and try again', 408);
      }

      // If it's a fetch error (network issues)
      if (error.message.includes('fetch')) {
        throw createError('Network error - please try again later', 500);
      }

      throw createError('Failed to get AI response - please try again', 500);
    }
  }

  async createOrUpdateChat(userId: string, data: IChatCreate): Promise<IChatResponse> {
    try {
      console.log('🚀 Starting createOrUpdateChat method');
      console.log('👤 User ID:', userId);
      console.log('💬 Message length:', data.message?.length || 0);
      console.log('🆔 Chat ID:', data.chatId || 'NEW CHAT');

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
    } catch (error: any) {
      console.error('❌ Error in createOrUpdateChat:', error.message);
      console.error('🔍 Error details:', error);
      throw error;
    }
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
