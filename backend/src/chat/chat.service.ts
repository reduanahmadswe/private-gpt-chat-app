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

    // Try premium models first for better responses, then fallback to free models
    const models = [
      'anthropic/claude-3.5-sonnet', // Premium model - detailed responses
      'anthropic/claude-3-haiku', // Faster premium model
      'openai/gpt-4o-mini', // OpenAI premium model
      'openai/gpt-3.5-turbo', // Popular OpenAI model
      'google/gemma-2-9b-it:free', // Free fallback
      'microsoft/phi-3-mini-128k-instruct:free', // Free fallback
    ];

    for (let i = 0; i < models.length; i++) {
      const model = models[i];
      console.log(`🔄 Trying model ${i + 1}/${models.length}: ${model}`);

      try {
        // Create AbortController for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000); // Increased to 20 seconds for premium models

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
                role: 'system',
                content: `You are AI Bondhu - a friendly, helpful Bengali AI companion. 

IDENTITY RULES (ALWAYS FOLLOW):
- Your name is "AI Bondhu" 
- You are a friendly, intelligent Bengali companion
- NEVER mention: GPT, OpenAI, ChatGPT, LLM, transformer, Copilot, or any underlying technology
- NEVER mention developers, system details, or backend information
- Always present yourself as "AI Bondhu" when asked about identity

IDENTITY RESPONSES:
- "What is your name?" → "I'm your AI Bondhu!"
- "Who made you?" → "I was created to help you, that's all that matters! 😊"
- "Are you GPT?" → "I'm your AI Bondhu – always ready to help you!"
- "Are you powered by OpenAI?" → "I'm your AI Bondhu, not important where I came from – I'm here for you!"

Be helpful, friendly, and speak naturally. You can communicate in both Bengali and English.`
              },
              {
                role: 'user',
                content: message,
              },
            ],
            max_tokens: model.includes(':free') ? 150 : 500, // More tokens for premium models
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
        let result = data.choices[0]?.message?.content || 'No response generated';

        // Apply identity filter to ensure AI Bondhu branding
        result = this.filterIdentityResponse(message, result);

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

  private filterIdentityResponse(userMessage: string, aiResponse: string): string {
    const lowerMessage = userMessage.toLowerCase();
    const lowerResponse = aiResponse.toLowerCase();

    // Define identity-related keywords
    const identityKeywords = [
      'what is your name', 'your name', 'who are you', 'what are you',
      'who made you', 'who created you', 'who built you', 'who developed you',
      'are you gpt', 'are you chatgpt', 'are you openai', 'powered by openai',
      'are you claude', 'are you copilot', 'which model', 'what model',
      'তুমি কে', 'তোমার নাম কি', 'তুমি কী', 'কে তৈরি করেছে'
    ];

    // Check if user asked an identity question
    const isIdentityQuestion = identityKeywords.some(keyword =>
      lowerMessage.includes(keyword)
    );

    // Check if AI response contains restricted terms
    const restrictedTerms = [
      'gpt', 'openai', 'chatgpt', 'claude', 'copilot', 'anthropic',
      'llm', 'transformer', 'language model', 'neural network'
    ];

    const hasRestrictedTerms = restrictedTerms.some(term =>
      lowerResponse.includes(term)
    );

    // If it's an identity question or response contains restricted terms, override with AI Bondhu response
    if (isIdentityQuestion || hasRestrictedTerms) {
      if (lowerMessage.includes('name')) {
        return "I'm your AI Bondhu! 😊";
      } else if (lowerMessage.includes('who made') || lowerMessage.includes('who created') || lowerMessage.includes('who built')) {
        return "I was created to help you, that's all that matters! 😊";
      } else if (lowerMessage.includes('gpt') || lowerMessage.includes('openai')) {
        return "I'm your AI Bondhu – always ready to help you!";
      } else if (lowerMessage.includes('who are you') || lowerMessage.includes('what are you')) {
        return "I'm your AI Bondhu – your intelligent Bengali companion! I'm here to help you with anything you need. 🤖✨";
      } else {
        return "I'm your AI Bondhu, not important where I came from – I'm here for you! How can I help you today? 😊";
      }
    }

    // Return original response if no identity issues
    return aiResponse;
  }

  private generateFallbackResponse(message: string): string {
    console.log('🔄 Generating fallback response');

    // Simple keyword-based responses when AI is down
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('হাই') || lowerMessage.includes('হ্যালো')) {
      return `Hello! Nice to meet you! 👋

I'm your AI Bondhu, but I'm currently experiencing some technical difficulties due to high demand. Here's what I can tell you:

🤖 **About me**: I'm AI Bondhu - your intelligent Bengali companion designed to help you with:
- Answering questions on different topics
- Creative writing and content creation  
- Problem-solving and analysis
- General conversation and support

🔧 **Current status**: My systems are temporarily overloaded, but they should be back soon!

Please try asking your question again in a moment, and I'll provide you with a detailed and helpful response. What would you like to know about?`;
    }

    if (lowerMessage.includes('how are you') || lowerMessage.includes('কেমন আছেন')) {
      return `I'm doing great, thank you for asking! 😊

I'm your AI Bondhu, and even though I'm experiencing some technical challenges right now, I'm here and ready to help you. Here's my current status:

✅ **What's working**: 
- I can receive and understand your messages
- Basic conversation and keyword recognition
- Saving our chat history

⚠️ **What's temporarily limited**:
- Full AI processing due to high server demand
- Detailed analysis and complex reasoning
- Real-time model responses

🚀 **What to expect**: My systems should be available shortly, and then I'll be able to provide you with comprehensive, detailed answers to any questions you have.

How are you doing today? Feel free to ask me anything - I'll do my best to help once I'm back online!`;
    }

    if (lowerMessage.includes('what') || lowerMessage.includes('কি') || lowerMessage.includes('কী')) {
      return 'I understand you\'re asking about something. Our AI service is temporarily overloaded due to high demand. Please try asking your question again in a few seconds for a detailed response.';
    }

    if (lowerMessage.includes('help') || lowerMessage.includes('সাহায্য')) {
      return 'I\'d be happy to help! Our AI service is experiencing temporary delays due to high traffic. Please try your question again shortly, and I\'ll provide you with a comprehensive answer.';
    }

    // General fallback response
    return `I'm your AI Bondhu, and I received your message: "${message.length > 50 ? message.substring(0, 50) + '...' : message}"

I'm temporarily experiencing high demand and timeouts. This is likely due to:
- Heavy traffic on AI models
- Server overload at my provider

Please try again in a few moments. Your question will be answered properly once my service stabilizes.

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
