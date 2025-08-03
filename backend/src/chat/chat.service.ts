import { envVars } from '../config/env';
import { createError } from '../shared/middleware/errorHandler';
import { IChatCreate, IChatResponse, IChatUpdate } from './chat.interface';
import { Chat } from './chat.model';

export class ChatService {
  private async callOpenRouterAPI(message: string): Promise<string> {
    // First try OpenRouter API
    try {
      return await this.tryOpenRouter(message);
    } catch (error) {
      console.log('📢 OpenRouter failed, trying fallback response...');
      // Return a helpful fallback response when OpenRouter is down
      return this.generateFallbackResponse(message);
    }
  }

  private async tryOpenRouter(message: string): Promise<string> {
    const apiKey = envVars.OPENROUTER_API_KEY;
    const baseURL = envVars.OPENAI_API_BASE_URL;

    console.log('🤖 Starting OpenRouter API call...');
    console.log('📝 Message length:', message.length);
    console.log('🔑 API Key present:', !!apiKey);

    // Try multiple free models in order of reliability
    const models = [
      'google/gemma-2-9b-it:free',
      'microsoft/phi-3-mini-128k-instruct:free',
      'meta-llama/llama-3.1-8b-instruct:free'
    ];

    for (let i = 0; i < models.length; i++) {
      const model = models[i];
      console.log(`🔄 Trying model ${i + 1}/${models.length}: ${model}`);

      try {
        // Create AbortController for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // Even shorter: 10 seconds

        const response = await fetch(`${baseURL}/chat/completions`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': envVars.FRONTEND_URL,
            'X-Title': 'Private GPT Chat',
          },
          body: JSON.stringify({
            model: model,
            messages: [
              {
                role: 'user',
                content: message,
              },
            ],
            max_tokens: 80, // Very small for speed
            temperature: 0.7,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error(`❌ Model ${model} failed:`, errorData);

          // Try next model if available
          if (i < models.length - 1) continue;

          // Last model failed, throw error
          throw new Error(`All models failed. Last error: ${JSON.stringify(errorData)}`);
        }

        const data: any = await response.json();
        const result = data.choices[0]?.message?.content || 'No response generated';
        console.log(`✅ Success with model: ${model}`);
        return result;

      } catch (error: any) {
        console.error(`❌ Error with model ${model}:`, error.message);

        // If it's the last model, throw the error
        if (i === models.length - 1) {
          throw error;
        }

        // Continue to next model
        continue;
      }
    }

    throw new Error('All models failed');
  }

  private generateFallbackResponse(message: string): string {
    console.log('🔄 Generating fallback response');

    // Simple keyword-based responses when AI is down
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('হাই') || lowerMessage.includes('হ্যালো')) {
      return 'Hello! I apologize, but our AI service is temporarily experiencing high demand. Please try again in a few moments. How can I help you today?';
    }

    if (lowerMessage.includes('how are you') || lowerMessage.includes('কেমন আছেন')) {
      return 'I\'m doing well, thank you! Our AI service is currently under heavy load, but I\'m here to help. Please try your question again in a moment.';
    }

    if (lowerMessage.includes('what') || lowerMessage.includes('কি') || lowerMessage.includes('কী')) {
      return 'I understand you\'re asking about something. Our AI service is temporarily overloaded due to high demand. Please try asking your question again in a few seconds for a detailed response.';
    }

    if (lowerMessage.includes('help') || lowerMessage.includes('সাহায্য')) {
      return 'I\'d be happy to help! Our AI service is experiencing temporary delays due to high traffic. Please try your question again shortly, and I\'ll provide you with a comprehensive answer.';
    }

    // General fallback response
    return `I received your message: "${message.length > 50 ? message.substring(0, 50) + '...' : message}"

Our AI service is temporarily experiencing high demand and timeouts. This is likely due to:
- Heavy traffic on free AI models
- Server overload at our AI provider

Please try again in a few moments. Your question will be answered properly once the service stabilizes.

Thank you for your patience! 🙏`;
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
